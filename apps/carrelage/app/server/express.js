import express from 'express';
import { ValidationError } from 'express-validation';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import httpStatus from 'http-status';
import responseTime from 'response-time';
import i18n from 'i18n';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginExpress from '@bugsnag/plugin-express';

import config from './config';
import logger, { logHttpRequest, logHttpResponse } from './logger';
import auth from './auth';
import routes from '../routes/index';
import APIError from '../helpers/api-error';
import UnhandledAPIError from '../helpers/unhandled-api-error';
import { requestObject } from '../helpers/request-object';

i18n.configure({
    locales: ['en'],
    defaultLocale: 'en',
    directory: '/app/locales',
});

Bugsnag.start({
    apiKey: config.BUGSNAG_API_KEY,
    plugins: [BugsnagPluginExpress],
    releaseStage: config.NODE_ENV,
    appVersion: config.VERSION,
});

const bugsnagMiddleware = Bugsnag.getPlugin('express');

const app = express();

app.use(bugsnagMiddleware.requestHandler);
app.use(
    bodyParser.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        },
    }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compress());
app.use(methodOverride());
app.use(helmet());
app.use(
    cors({
        origin: config.CORS_ALLOWED,
        credentials: true,
    }),
);
app.use(responseTime());

app.use(cookieParser(config.COOKIE_SECRET));
app.use(auth.initialize());

app.use(i18n.init);

// HTTP Request logging
app.use(logHttpRequest());

// Init RequestObject
app.use(requestObject);

// Init API routes
app.use('/', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
        const unifiedErrorMessage = err.errors.map((e) => e.messages.join('. ')).join(' and ');
        const error = new APIError(unifiedErrorMessage, err.status);
        return next(error);
    } else if (!(err instanceof APIError)) {
        const apiError = new UnhandledAPIError(err);
        return next(apiError);
    }
    return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new APIError(['%s %s not found', req.method, req.path], httpStatus.NOT_FOUND);
    return next(err);
});

// error handler, send stacktrace only in development.
app.use((err, req, res, next) => {
    const json = {
        code: err.status,
        type: err.type,
        status: httpStatus[err.status],
        message: Array.isArray(err.message) ? req.__(...err.message) : err.message,
    };
    if (config.NODE_ENV === 'development' || config.NODE_ENV === 'test') {
        json.stack = err.stack;
    }

    res.status(err.status).json(json);

    json.stack = err.stack;
    if (err instanceof APIError) {
        logger.warn(json);
    } else {
        req.bugsnag.notify(err);
        logger.error(json);
    }

    next();
});

// HTTP Response logging
app.use(logHttpResponse());
app.use(bugsnagMiddleware.errorHandler);

export default app;

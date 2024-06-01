import Bunyan from 'bunyan';
import httpStatus from 'http-status';

import config from './config';

const BUNYAN_TO_STACKDRIVER = {
    60: 'CRITICAL',
    50: 'ERROR',
    40: 'WARNING',
    30: 'INFO',
    20: 'DEBUG',
    10: 'DEBUG',
};

class SeverityStream {
    // eslint-disable-next-line
    write(data) {
        if (typeof data === 'object') {
            const modified = data;
            modified.severity = BUNYAN_TO_STACKDRIVER[data.level];
            process.stdout.write(`${JSON.stringify(modified)}\n`);
        }
    }
}

const logger = new Bunyan({
    name: 'carrelage',
    streams: [{ level: config.LOG_LEVEL, type: 'raw', stream: new SeverityStream() }],
});

export function logHttpRequest() {
    return (req, res, next) => {
        const log = {
            http: 'Request',
            method: req.method,
            url: req.originalUrl,
            'client-ip': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            'http-version': req.httpVersion,
            headers: Object.assign({}, req.headers),
            params: Object.assign({}, req.params),
            query: Object.assign({}, req.query),
            body: Object.assign({}, req.body),
        };

        delete log.headers.authorization;
        delete log.headers.cookie;
        delete log.params.password;
        delete log.query.password;
        delete log.body.password;

        if (!(req.originalUrl === '/')) {
            logger.info(log);
        }

        next();
    };
}

export function logHttpResponse() {
    return (req, res, next) => {
        const log = {
            http: 'Response',
            method: req.method,
            url: req.originalUrl,
            'client-ip': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            'response-time': res.getHeader('X-Response-Time'),
            status: {
                code: res.statusCode,
                message: httpStatus[res.statusCode],
            },
        };

        if (res.statusCode >= httpStatus.CONTINUE && res.statusCode <= httpStatus.TEMPORARY_REDIRECT) {
            if (!(res.statusCode === httpStatus.OK && req.originalUrl === '/')) {
                logger.info(log);
            }
        } else if (
            res.statusCode >= httpStatus.BAD_REQUEST &&
            res.statusCode <= httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS
        ) {
            logger.warn(log);
        } else {
            logger.error(log);
        }

        next();
    };
}

export default logger;

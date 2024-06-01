const params = {
    VERSION: process.env.npm_package_version,
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
    API_URL: process.env.API_URL,
    API_PORT: process.env.API_PORT,
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
    CORS_ALLOWED: process.env.CORS_ALLOWED,
    ROOT_EMAIL: process.env.ROOT_EMAIL,
    ROOT_PASSWD: process.env.ROOT_PASSWD,
    ROOT_TOKEN: process.env.ROOT_TOKEN,
    FRONT_URL: process.env.FRONT_URL,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    MONGO_URL: process.env.MONGO_URL,
    GOOGLE_KEY: process.env.GOOGLE_KEY,
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    GCLOUD_STORAGE_BUCKET: process.env.GCLOUD_STORAGE_BUCKET,
    GCLOUD_STORAGE_FOLDER: process.env.GCLOUD_STORAGE_FOLDER,
    GCLOUD_CDN_URL: process.env.GCLOUD_CDN_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY,
    GERANIUM_URL: process.env.GERANIUM_URL,
    GERANIUM_TOKEN: process.env.GERANIUM_TOKEN,
    FB_APP_ID: process.env.FB_APP_ID,
    FB_APP_SECRET: process.env.FB_APP_SECRET,
    FB_ACCESS_TOKEN: process.env.FB_ACCESS_TOKEN,
    FB_APP_NAME: process.env.FB_APP_NAME,
    MAILGUN_KEY: process.env.MAILGUN_KEY,
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
    MAIL_FROM_EMAIL: process.env.MAIL_FROM_EMAIL,
    VIMEO_AUTH: process.env.VIMEO_AUTH,
    AIRTABLE_KEY: process.env.AIRTABLE_KEY,
    AIRTABLE_APP_ID: process.env.AIRTABLE_APP_ID,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_ADMIN_KEY: process.env.ALGOLIA_ADMIN_KEY,
    STRIPE_KEY: process.env.STRIPE_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_USD_PLAN: process.env.STRIPE_USD_PLAN,
    STRIPE_EUR_PLAN: process.env.STRIPE_EUR_PLAN,
    BUGSNAG_API_KEY: process.env.BUGSNAG_API_KEY,
};

Object.keys(params).forEach((key) => {
    const val = params[key];
    if (val === undefined) {
        throw new Error(`${key.toString()} env is missing`);
    }
});

params.CORS_ALLOWED = params.CORS_ALLOWED.split(',');

if (
    !(
        params.NODE_ENV === 'production' ||
        params.NODE_ENV === 'staging' ||
        params.NODE_ENV === 'test' ||
        params.NODE_ENV === 'development'
    )
) {
    throw new Error("NODE_ENV could only take 'production', 'staging', 'test' or 'development' values");
}

if (
    !(
        params.LOG_LEVEL === 'fatal' ||
        params.LOG_LEVEL === 'error' ||
        params.LOG_LEVEL === 'warn' ||
        params.LOG_LEVEL === 'info' ||
        params.LOG_LEVEL === 'debug' ||
        params.LOG_LEVEL === 'trace'
    )
) {
    throw new Error('LOG_LEVEL is not set or invalid');
}

export default params;

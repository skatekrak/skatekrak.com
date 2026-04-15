import formData from 'form-data';
import Mailgun from 'mailgun.js';

import { env } from '../env';

import type { MailgunMessageData } from 'mailgun.js/interfaces/Messages';

const mailgun = new Mailgun(formData);
const mailgunClient = mailgun.client({
    username: 'api',
    key: env.MAILGUN_KEY,
});

export const sendEmail = (options: MailgunMessageData) => {
    return mailgunClient.messages.create(env.MAILGUN_DOMAIN, options);
};

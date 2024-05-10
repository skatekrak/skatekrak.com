import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { MailgunMessageData } from 'mailgun.js/interfaces/Messages';

import config from '../server/config';

const mailgun = new Mailgun(formData);
const mailgunClient = mailgun.client({
    username: 'api',
    key: config.MAILGUN_KEY,
});

export default mailgunClient;

export const send = (options: MailgunMessageData) => {
    return mailgunClient.messages.create(config.MAILGUN_DOMAIN, options);
};

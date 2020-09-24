import client from '@sendgrid/client';
import email from '@sendgrid/mail';

client.setApiKey(process.env.SENDGRID_KEY);
email.setApiKey(process.env.SENDGRID_KEY);
email.setSubstitutionWrappers('{{', '}}');

export { email, client };

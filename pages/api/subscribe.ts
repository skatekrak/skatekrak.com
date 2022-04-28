import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import crypto from 'crypto';

import { email as Email } from 'lib/sendgrid';

const cors = Cors({
    methods: ['GET', 'POST', 'HEAD'],
    origin: '/.skatekrak.com$/',
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }

            return resolve(result);
        });
    });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

    if (req.method !== 'POST') {
        return res.status(400).json({ message: 'Must be a POST' });
    }

    const email = req.query.email;
    if (email == null) {
        return res.status(400).json({ message: 'Missing email' });
    }

    if (typeof email !== 'string') {
        return res.status(400).json({ message: 'Email must be a string' });
    }

    // generate a random token
    const emailBuffer = Buffer.from(email);
    const tokenBuffer = crypto.randomBytes(20);
    const token = Buffer.concat([emailBuffer, tokenBuffer]).toString('base64');

    try {
        await Email.send({
            personalizations: [
                {
                    to: req.body.email,
                    substitutions: {
                        link: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/newsletter?token=${encodeURIComponent(token)}`,
                    },
                    customArgs: {
                        type: 'opt-in',
                        time_sent: String(Date.now()),
                    },
                },
            ],
            from: {
                name: 'The Krak Team',
                email: 'hey@skatekrak.com',
            },
            templateId: 'd7699f3e-0138-4181-a355-c5d9dd324cb9',
            asm: {
                groupId: 8830,
            },
        });

        return res.status(200).json({ message: 'Confirmation email sent' });
    } catch (error) {
        return res.status(500).json({ error: 'Error sending an email' });
    }
};

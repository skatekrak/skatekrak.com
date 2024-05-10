import got from 'got';

import config from '../server/config';
import logger from '../server/logger';

/**
 * Send a message to a Krak slack channel
 * @param {string} channel - Name of the channel to send the message to
 */
function sendMessageFeedback(channel, feedback) {
    logger.debug('Will send a slack message');
    const body = {
        username: 'Carrelage Feedback',
        icon_emoji: ':robot_face:',
        channel,
        attachments: [
            {
                fallback: `<!here|here>: New feedback on the app by ${feedback.addedBy}: "${feedback.message}"`,
                title: '<!here|here>: New Feedback on the app!',
                fields: [
                    {
                        title: 'Username',
                        value: feedback.addedBy,
                        short: true,
                    },
                    {
                        title: 'Message',
                        value: feedback.message,
                    },
                ],
                color: '#008000',
            },
        ],
    };

    const options = {
        body: JSON.stringify(body),
        headers: {
            'user-agent': 'Carrelage https://api.carrelage.skatekrak.com 1.0.9',
        },
    };

    if (config.NODE_ENV !== 'development' && config.NODE_ENV !== 'test') {
        // got.post(config.SLACK_URL, options)
        //     .then((response) => {
        //         logger.debug('Response from slack message set', response.body);
        //         logger.info('Sent Slack message to notify new feedback #', feedback.id);
        //     })
        //     .catch((e) => {
        //         logger.error('Error while trying to send slack message', e);
        //     });
    }
}

export default { sendMessageFeedback };

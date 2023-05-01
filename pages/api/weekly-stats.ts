import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { startOfWeek, endOfWeek } from 'date-fns';
import Feudartifice from 'shared/feudartifice';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(400).json({ message: 'Must be a POST' });
    }

    if (req.headers['Authorizaion'] != `Bearer ${process.env.ADMIN_TOKEN}`) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const stats = await Feudartifice.admin.getStats(
        { from: startOfWeek(new Date()), to: endOfWeek(new Date()) },
        process.env.ADMIN_TOKEN,
    );

    await axios.post(process.env.DISCORD_HOOK_URL, {
        content: `**Weekly stats**\nspot: ${stats.spots}\nmedia: ${stats.media}`,
    });

    res.status(200).json({ message: 'sent' });
};

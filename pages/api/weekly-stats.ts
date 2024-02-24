import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { startOfWeek, endOfWeek, sub } from 'date-fns';
import Feudartifice from 'shared/feudartifice';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(400).json({ message: 'Must be a POST' });
    }

    if (req.query['key'] != 'clh4xjuai0000yn9mdd1n4jvc') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const lastWeekDay = sub(new Date(), { weeks: 1 });
    const stats = await Feudartifice.admin.getStats(
        { from: startOfWeek(lastWeekDay, { weekStartsOn: 1 }), to: endOfWeek(lastWeekDay, { weekStartsOn: 1 }) },
        process.env.ADMIN_TOKEN!,
    );

    await axios.post(process.env.DISCORD_HOOK_URL!, {
        content: `**Last week stats 📈**\nspot: ${stats.spots}\nmedia: ${stats.media}`,
    });

    res.status(200).json({ message: 'sent' });
};

import got from 'got';

async function getMagFeed() {
    const { body: feed } = await got('https://mag.skatekrak.com/feed/json/', { json: true });
    for (const item of feed) {
        const [, thumb] = item.thumbnail.split(', ');
        const [thumbUrl] = thumb.split(' ');
        delete item.thumbnail;
        if (thumbUrl) {
            item.thumbnail = thumbUrl;
        }
        item.caption = item.excerpt;
        delete item.excerpt;
        delete item.content;
        delete item.tags;
    }
    return feed;
}

export default { getMagFeed };

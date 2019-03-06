import React from 'react';

import FeaturedVideo from 'components/pages/videos/FeaturedVideo';
import VideoCard from 'components/pages/videos/VideoCard';

const videos = [
    {
        order: 2,
        createdAt: '2019-02-20T07:21:53.000Z',
        source: {
            type: 'youtube',
            topics: [
                'skate',
                'skateboarding',
                'skate krak',
                'skatelife',
                'skatespots',
                'skateboarders',
                'skateparks',
                'skater',
            ],
            label: 'Krak',
            title: 'Krak',
            description:
                "We make products for skateboarders: #krakbox #krakapp #krakmag & #krakmap. It's all about skateboarding so go flip yourself 🐙",
            iconUrl:
                'https://yt3.ggpht.com/a-/AAuE7mCI2Ugs_cXguTdMyC3p-3JrXMjeLaiJnJ7m9A=s800-mo-c-c0xffffffff-rj-k-no',
            coverUrl:
                'https://yt3.ggpht.com/iCANdksFPXAnSgAol6mHQd_8YsMRIKyOBM5adFjZSRIIMDXgwxQF5OESuqGI9FcxdMMn7mzu9Q=w1060-fcrop64=1,00005a57ffffa5a8-nd-c0xffffffff-rj-k-no',
            youtube: {
                channelId: 'UC1o-dFTrXKLa6Ov8GiysF7g',
                publishedAt: '2014-12-08T01:23:24.000Z',
                country: 'US',
            },
            createdAt: '2019-02-28T16:03:15.193Z',
            updatedAt: '2019-02-28T16:03:15.193Z',
            id: '5c7806432071aa001ca97735',
        },
        videoId: 'TP_FoelaJXo',
        title: 'Macba Low To High Ledge, Barcelona - History Clip',
        description:
            "All the tricks we have in mind landed at the Macba Low To High Ledge in Barcelona, Spain. Check out our KrakMag online [http://krakmag.com] we're gonna ...",
        thumbnail: 'https://i.ytimg.com/vi/TP_FoelaJXo/hqdefault.jpg',
        updatedAt: '2019-02-20T07:21:53.000Z',
        id: '5c780643zefzef2071aa001ca97765',
    },
    {
        order: 1,
        createdAt: '2019-02-14T12:04:40.000Z',
        source: {
            type: 'youtube',
            topics: [
                'skate',
                'skateboarding',
                'skate krak',
                'skatelife',
                'skatespots',
                'skateboarders',
                'skateparks',
                'skater',
            ],
            label: 'Krak',
            title: 'Krak',
            description:
                "We make products for skateboarders: #krakbox #krakapp #krakmag & #krakmap. It's all about skateboarding so go flip yourself 🐙",
            iconUrl:
                'https://yt3.ggpht.com/a-/AAuE7mCI2Ugs_cXguTdMyC3p-3JrXMjeLaiJnJ7m9A=s800-mo-c-c0xffffffff-rj-k-no',
            coverUrl:
                'https://yt3.ggpht.com/iCANdksFPXAnSgAol6mHQd_8YsMRIKyOBM5adFjZSRIIMDXgwxQF5OESuqGI9FcxdMMn7mzu9Q=w1060-fcrop64=1,00005a57ffffa5a8-nd-c0xffffffff-rj-k-no',
            youtube: {
                channelId: 'UC1o-dFTrXKLa6Ov8GiysF7g',
                publishedAt: '2014-12-08T01:23:24.000Z',
                country: 'US',
            },
            createdAt: '2019-02-28T16:03:15.193Z',
            updatedAt: '2019-02-28T16:03:15.193Z',
            id: '5c7806432071aa001ca97735',
        },
        videoId: 'j5pZpUKwft4',
        title: 'Krakhead #1 - Felix Baillet',
        description:
            "Here is the first episode of our new serie called 'Krakhead - A zoom on one of our active member who post regularly some good footy on the app. Meet Félix ...",
        thumbnail: 'https://i.ytimg.com/vi/j5pZpUKwft4/hqdefault.jpg',
        updatedAt: '2019-02-14T12:04:40.000Z',
        id: '5c780643zefzef2071aa001ca9778a',
    },
    {
        order: 1,
        createdAt: '2019-02-14T12:04:40.000Z',
        source: {
            type: 'youtube',
            topics: [
                'skate',
                'skateboarding',
                'skate krak',
                'skatelife',
                'skatespots',
                'skateboarders',
                'skateparks',
                'skater',
            ],
            label: 'Krak',
            title: 'Krak',
            description:
                "We make products for skateboarders: #krakbox #krakapp #krakmag & #krakmap. It's all about skateboarding so go flip yourself 🐙",
            iconUrl:
                'https://yt3.ggpht.com/a-/AAuE7mCI2Ugs_cXguTdMyC3p-3JrXMjeLaiJnJ7m9A=s800-mo-c-c0xffffffff-rj-k-no',
            coverUrl:
                'https://yt3.ggpht.com/iCANdksFPXAnSgAol6mHQd_8YsMRIKyOBM5adFjZSRIIMDXgwxQF5OESuqGI9FcxdMMn7mzu9Q=w1060-fcrop64=1,00005a57ffffa5a8-nd-c0xffffffff-rj-k-no',
            youtube: {
                channelId: 'UC1o-dFTrXKLa6Ov8GiysF7g',
                publishedAt: '2014-12-08T01:23:24.000Z',
                country: 'US',
            },
            createdAt: '2019-02-28T16:03:15.193Z',
            updatedAt: '2019-02-28T16:03:15.193Z',
            id: '5c7806432071aa001ca97735',
        },
        videoId: 'j5pZpUKwft4',
        title: 'Krakhead #1 - Felix Baillet',
        description:
            "Here is the first episode of our new serie called 'Krakhead - A zoom on one of our active member who post regularly some good footy on the app. Meet Félix ...",
        thumbnail: 'https://i.ytimg.com/vi/j5pZpUKwft4/hqdefault.jpg',
        updatedAt: '2019-02-14T12:04:40.000Z',
        id: 'adazdazefzefzd5azd5azd5a5zd5',
    },
    {
        order: 1,
        createdAt: '2019-02-14T12:04:40.000Z',
        source: {
            type: 'youtube',
            topics: [
                'skate',
                'skateboarding',
                'skate krak',
                'skatelife',
                'skatespots',
                'skateboarders',
                'skateparks',
                'skater',
            ],
            label: 'Krak',
            title: 'Krak',
            description:
                "We make products for skateboarders: #krakbox #krakapp #krakmag & #krakmap. It's all about skateboarding so go flip yourself 🐙",
            iconUrl:
                'https://yt3.ggpht.com/a-/AAuE7mCI2Ugs_cXguTdMyC3p-3JrXMjeLaiJnJ7m9A=s800-mo-c-c0xffffffff-rj-k-no',
            coverUrl:
                'https://yt3.ggpht.com/iCANdksFPXAnSgAol6mHQd_8YsMRIKyOBM5adFjZSRIIMDXgwxQF5OESuqGI9FcxdMMn7mzu9Q=w1060-fcrop64=1,00005a57ffffa5a8-nd-c0xffffffff-rj-k-no',
            youtube: {
                channelId: 'UC1o-dFTrXKLa6Ov8GiysF7g',
                publishedAt: '2014-12-08T01:23:24.000Z',
                country: 'US',
            },
            createdAt: '2019-02-28T16:03:15.193Z',
            updatedAt: '2019-02-28T16:03:15.193Z',
            id: '5c7806432071afefea001ca97735',
        },
        videoId: 'j5pZpUKwft4',
        title: 'Krakhead #1 - Felix Baillet',
        description:
            "Here is the first episode of our new serie called 'Krakhead - A zoom on one of our active member who post regularly some good footy on the app. Meet Félix ...",
        thumbnail: 'https://i.ytimg.com/vi/j5pZpUKwft4/hqdefault.jpg',
        updatedAt: '2019-02-14T12:04:40.000Z',
        id: 'azdazdaz6da4d4azd4az5d5azd5',
    },
    {
        order: 1,
        createdAt: '2019-02-14T12:04:40.000Z',
        source: {
            type: 'youtube',
            topics: [
                'skate',
                'skateboarding',
                'skate krak',
                'skatelife',
                'skatespots',
                'skateboarders',
                'skateparks',
                'skater',
            ],
            label: 'Krak',
            title: 'Krak',
            description:
                "We make products for skateboarders: #krakbox #krakapp #krakmag & #krakmap. It's all about skateboarding so go flip yourself 🐙",
            iconUrl:
                'https://yt3.ggpht.com/a-/AAuE7mCI2Ugs_cXguTdMyC3p-3JrXMjeLaiJnJ7m9A=s800-mo-c-c0xffffffff-rj-k-no',
            coverUrl:
                'https://yt3.ggpht.com/iCANdksFPXAnSgAol6mHQd_8YsMRIKyOBM5adFjZSRIIMDXgwxQF5OESuqGI9FcxdMMn7mzu9Q=w1060-fcrop64=1,00005a57ffffa5a8-nd-c0xffffffff-rj-k-no',
            youtube: {
                channelId: 'UC1o-dFTrXKLa6Ov8GiysF7g',
                publishedAt: '2014-12-08T01:23:24.000Z',
                country: 'US',
            },
            createdAt: '2019-02-28T16:03:15.193Z',
            updatedAt: '2019-02-28T16:03:15.193Z',
            id: '5c7806432071aa001ca97735',
        },
        videoId: 'j5pZpUKwft4',
        title: 'Krakhead #1 - Felix Baillet',
        description:
            "Here is the first episode of our new serie called 'Krakhead - A zoom on one of our active member who post regularly some good footy on the app. Meet Félix ...",
        thumbnail: 'https://i.ytimg.com/vi/j5pZpUKwft4/hqdefault.jpg',
        updatedAt: '2019-02-14T12:04:40.000Z',
        id: 'adazd6az6da5zda4zdazdazdffe',
    },
];

type Props = {};

type State = {
    featuredVideo?: object;
};

class VideoFeed extends React.Component<Props, State> {
    public state: State = {};

    public componentDidMount() {
        this.getFeaturedVideo();
    }

    public render() {
        const { featuredVideo } = this.state;
        return (
            <div id="videos-feed-container">
                {featuredVideo && (
                    <div id="videos-feed-header" className="row">
                        <div className="col-xs-12">
                            <FeaturedVideo video={featuredVideo} />
                        </div>
                    </div>
                )}
                <div className="row">
                    {videos.map((video) => (
                        <div key={video.id} className="video-card-container col-xs-12 col-sm-6 col-lg-4">
                            <VideoCard video={video} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    private getFeaturedVideo = () => {
        for (const video of videos) {
            if (video.order === 1) {
                this.setState({ featuredVideo: video });
            }
        }
    };
}

export default VideoFeed;

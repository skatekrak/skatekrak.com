import classNames from 'classnames';
import * as React from 'react';

import Article from 'components/pages/news/Articles/Article';

type Props = {
    sourcesMenuIsOpen: boolean;
};

const fakeArticles = [
    {
        title: 'SIGHTINGS: December 2018',
        img: '/static/images/mags-logo/confusion.svg',
        desc: 'We re finishing the year strong with a nice batch of online exclusive SIGHTINGS from skaters and',
        url: '',
        source: {
            id: 'tws',
            name: 'TWS',
            url: '',
        },
    },
    {
        title: 'No Hotels "Spot! Pull Over" Video',
        img: '/static/images/club-presentation-bg.jpg',
        desc: 'With faith and resilience the crew crossed the continent width and lengthwise, California to New York.',
        url: '',
        source: {
            id: 'zef',
            name: 'Thrasher Magazine',
            url: '',
        },
    },
    {
        title: 'Loveletters Season 9: Grosso’s Not Going Off | Jeff Grosso’s Loveletters to Skateboarding',
        img: '/static/images/mags-logo/vhs-mag.png',
        desc:
            'Gaston Francisco organized a super trip through the cities of the Mayan civilization of Central America.',
        url: '',
        source: {
            id: 'zef',
            name: 'Grey',
            url: '',
        },
    },
    {
        title: 'Snack Skateboards in Japan',
        img: '/static/images/mags-logo/street-piracy.svg',
        desc: 'Roger Krebs, Adrian Williams, CJ Carter, Josh Riviere, Kojiro Hara and Yudai Fujigasaki come through.',
        url: '',
        source: {
            id: 'zef',
            name: 'Street Piracy',
            url: '',
        },
    },
];

const Articles: React.SFC<Props> = ({ sourcesMenuIsOpen }) => (
    <div id="news-articles-container" className="col-xs-12 col-md-8 col-lg-9">
        <div
            className={classNames('row', {
                hide: sourcesMenuIsOpen,
            })}
        >
            {fakeArticles.length === 0 && (
                <div id="news-articles-no-content">
                    <p id="news-articles-no-content-title">No news to display</p>
                    <p id="news-articles-no-content-text">Select some mags to be back in the loop</p>
                </div>
            )}
            {fakeArticles.map((article) => (
                <Article
                    key={article.title}
                    title={article.title}
                    img={article.img}
                    desc={article.desc}
                    url={article.url}
                    source={article.source}
                />
            ))}
        </div>
    </div>
);

export default Articles;

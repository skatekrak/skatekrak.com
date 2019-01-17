import React from 'react';
import { connect } from 'react-redux';
import { Content } from 'rss-feed';

import Ad from 'components/pages/news/Articles/Article/Ad';
import Card from 'components/pages/news/Articles/Article/Card';
import { FeedLayout, State as SettingState } from 'store/reducers/setting';

type Props = {
    content: Content;
    index: number;
    feedLayout: FeedLayout;
};

type State = {
    isClubPromotion: boolean;
};

class Article extends React.PureComponent<Props, State> {
    public state: State = {
        isClubPromotion: false,
    };

    public componentDidMount() {
        const { index, feedLayout } = this.props;
        switch (feedLayout) {
            case FeedLayout.OneColumn:
                break;
            case FeedLayout.TwoColumns:
                break;
            default:
                break;
        }
    }

    public render() {
        const { content } = this.props;
        const { isClubPromotion } = this.state;

        return (
            <div className="news-article col-xs-12 col-sm-6 col-lg-3">
                {!isClubPromotion ? <Card content={content} /> : <Ad />}
            </div>
        );
    }
}

export default connect((state: { setting: SettingState }) => ({ feedLayout: state.setting.feedLayout }))(Article);

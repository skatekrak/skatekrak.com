import * as React from 'react';

import Layout from 'components/Layout/Layout';
import Page from 'components/pages/Page';

import Articles from 'components/pages/news/Articles';
import Menu from 'components/pages/news/Menu';

type State = {};

class News extends React.PureComponent<{}, State> {
    public state: State = {};

    public render() {
        return (
            <Page>
                <Layout>
                    <React.Fragment>
                        <div id="news-container" className="container-fluid">
                            <Menu />
                            <Articles />
                        </div>
                    </React.Fragment>
                </Layout>
            </Page>
        );
    }
}

export default News;

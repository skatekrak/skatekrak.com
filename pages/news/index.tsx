import * as React from 'react';

import Layout from 'components/Layout/Layout';
import Page from 'components/pages/Page';

type State = {};

class News extends React.PureComponent<{}, State> {
    public state: State = {};

    public render() {
        return (
            <Page>
                <Layout>
                    <React.Fragment>
                        <div id="news-container" className="container-fluid">
                            HELLO WORLD, it's a fucking gold mine over there !
                        </div>
                    </React.Fragment>
                </Layout>
            </Page>
        );
    }
}

export default News;

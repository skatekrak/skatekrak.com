import * as React from 'react';

import Layout from 'components/Layout/Layout';
import Page from 'components/pages/Page';

import Articles from 'components/pages/news/Articles';
import Menu from 'components/pages/news/Menu';

type State = {
    sourcesMenuIsOpen: boolean;
};

class News extends React.PureComponent<{}, State> {
    public state: State = {
        sourcesMenuIsOpen: false,
    };

    public render() {
        const { sourcesMenuIsOpen } = this.state;
        return (
            <Page>
                <Layout>
                    <React.Fragment>
                        <div id="news-container" className="container-fluid">
                            <div className="row">
                                <Menu
                                    sourcesMenuIsOpen={sourcesMenuIsOpen}
                                    handleOpenSourcesMenu={this.handleOpenSourcesMenu}
                                />
                                <Articles sourcesMenuIsOpen={sourcesMenuIsOpen} />
                            </div>
                        </div>
                    </React.Fragment>
                </Layout>
            </Page>
        );
    }

    private handleOpenSourcesMenu = () => {
        const { sourcesMenuIsOpen } = this.state;
        this.setState({ sourcesMenuIsOpen: !sourcesMenuIsOpen });
    };
}

export default News;

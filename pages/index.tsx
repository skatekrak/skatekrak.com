import axios, { AxiosError } from 'axios';
import validator from 'email-validator';
import React from 'react';

import Layout from 'components/Layout/Layout';
import Page from 'components/pages/Page';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import LikeIcon from 'components/Ui/Icons/Like';

type State = {
    subscribed: boolean;
    subscribeError?: string;
    email: string;
};

/* tslint:disable:max-line-length */
class Index extends React.PureComponent<{}, State> {
    public state: State = {
        email: '',
        subscribed: false,
        subscribeError: null,
    };

    public render() {
        const { email, subscribed, subscribeError } = this.state;
        return (
            <Page>
                <Layout>
                    <React.Fragment>
                        <div id="home-container" className="container-fluid">
                            <form id="home-news" onSubmit={this.handleSubmit}>
                                <h2 id="home-news-title">Get hooked up :</h2>
                                <input
                                    type="mail"
                                    id="home-news-input"
                                    placeholder="love@skatekrak.com"
                                    value={email}
                                    onChange={this.emailOnChange}
                                />
                                <button id="home-news-button">
                                    Subscribe
                                    <LikeIcon />
                                </button>
                                {subscribeError && <ErrorMessage message={subscribeError} />}
                                {subscribed && <span>We sent you an email to confirm</span>}
                            </form>
                            <div id="home-image" />
                        </div>
                        <div id="quote-container">
                            <p
                                id="quote"
                                data-text={
                                    '"Skateboarding is not a hobby. And it\'s not a sport. Skateboarding is way of learning how to redefine the world around you." Ian Mackaye - '
                                }
                            >
                                &quot;Skateboarding is not a hobby. And it's not a sport. Skateboarding is way of
                                learning how to redefine the world around you.&quot; Ian Mackaye&nbsp;-&nbsp;
                            </p>
                        </div>
                    </React.Fragment>
                </Layout>
            </Page>
        );
    }

    private emailOnChange = (email) => {
        this.setState({ email });
    };

    private handleSubmit = (event) => {
        event.preventDefault();
        const { email } = this.state;
        if (!validator.validate(email)) {
            this.setState({ subscribeError: 'This email is not valid' });
        } else {
            axios
                .post(`https://barde.skatekrak.com/emails`, { email })
                .then(() => this.setState({ subscribed: true, email: '' }))
                .catch((err: AxiosError) => this.setState({ subscribeError: err.response.data.message }));
        }
    };
}

export default Index;

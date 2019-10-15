import axios, { AxiosError } from 'axios';
import validator from 'email-validator';
import Head from 'next/head';
import React from 'react';

import Layout from 'components/Layout/Layout';
import TrackedPage from 'components/pages/TrackedPage';
import LikeIcon from 'components/Ui/Icons/Like';

type State = {
    subscribeError?: string;
    email: string;
};

const HomeHead = () => (
    <Head>
        <title>Krak</title>
        <meta
            name="description"
            content="Skateboarding is not a hobby. And it’s not a sport. Skateboarding is a way of learning how to redefine the world around you. Ian Mackaye."
        />
        <meta property="og:title" content="Krak" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skatekrak.com" />
        <meta property="og:image" content="https://skatekrak.com/images/og-home.jpg" />
        <meta
            property="og:description"
            content="Skateboarding is not a hobby. And it’s not a sport. Skateboarding is a way of learning how to redefine the world around you. Ian Mackaye"
        />
    </Head>
);

/* tslint:disable:max-line-length */
class Index extends React.PureComponent<{}, State> {
    public state: State = {
        email: '',
        subscribeError: null,
    };

    public render() {
        const { email } = this.state;
        return (
            <TrackedPage name="Homepage">
                <Layout head={<HomeHead />}>
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
            </TrackedPage>
        );
    }

    private emailOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: event.target.value });
    };

    private handleSubmit = event => {
        event.preventDefault();
        const { email } = this.state;
        if (!validator.validate(email)) {
            alert('This email is not valid');
        } else {
            axios
                .post(`https://barde.skatekrak.com/emails`, { email })
                .then(() => {
                    this.setState({ email: '' });
                    alert('We sent you an email to confirm your subscription!');
                })
                .catch((err: AxiosError) => this.setState({ subscribeError: err.response.data.message }));
        }
    };
}

export default Index;

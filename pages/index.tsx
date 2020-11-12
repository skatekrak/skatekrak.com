import axios, { AxiosError } from 'axios';
import validator from 'email-validator';
import Head from 'next/head';
import React from 'react';

import Layout from 'components/Layout/Layout';
import TrackedPage from 'components/pages/TrackedPage';
import KrakSymbole from 'components/Ui/branding/KrakSymbole';
import LikeIcon from 'components/Ui/Icons/Like';

type State = {
    subscribeError?: string;
    email: string;
};

const HomeHead = () => {
    const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;
    return (
        <Head>
            <title>Krak</title>
            <meta
                name="description"
                content="Skateboarding is not a hobby. And it’s not a sport. Skateboarding is a way of learning how to redefine the world around you. Ian Mackaye."
            />
            <meta property="og:title" content="Krak" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={baseURL} />
            <meta property="og:image" content={`${baseURL}/images/og-home.jpg`} />
            <meta
                property="og:description"
                content="Skateboarding is not a hobby. And it’s not a sport. Skateboarding is a way of learning how to redefine the world around you. Ian Mackaye"
            />
        </Head>
    );
};

/* tslint:disable:max-line-length */
class Index extends React.PureComponent<unknown, State> {
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
                            <div id="home-content">
                                <div id="home-symboles">
                                    <KrakSymbole />
                                    <KrakSymbole />
                                    <KrakSymbole />
                                </div>
                                <h1 id="home-title">
                                    The first skateboarding
                                    <br />
                                    tech <span>co-op</span>
                                </h1>
                                <form id="home-form" onSubmit={this.handleSubmit}>
                                    <label id="home-form-title" htmlFor="home-form-field-input">
                                        Become a co-owner
                                    </label>
                                    <div id="home-form-field">
                                        <input
                                            type="mail"
                                            id="home-form-field-input"
                                            placeholder="love@skatekrak.com"
                                            value={email}
                                            onChange={this.emailOnChange}
                                        />
                                        <button id="home-form-field-button">
                                            More Info
                                            <LikeIcon />
                                        </button>
                                    </div>
                                </form>
                                <p id="home-content-roots">
                                    Let's make sure skateboarding keeps its roots
                                    <br />
                                    deep in creativity, openness, rebellion & freedom
                                </p>
                                <div id="home-image-container-container">
                                    <div id="home-image-container">
                                        <div id="home-image" />
                                    </div>
                                </div>
                                <p id="home-owned">
                                    100% owned by skateboarders,
                                    <br />
                                    workers and community
                                </p>
                            </div>
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

    private handleSubmit = (event) => {
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

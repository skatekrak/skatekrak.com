import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <html>
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="with-device-with, initial-scale=1" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/static/images/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/static/images/favicon_32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/static/images/favicon_16.png" />
                    <script src="https://js.stripe.com/v3" />
                    <link href="https://fonts.googleapis.com/css?family=Permanent+Marker" rel="stylesheet" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

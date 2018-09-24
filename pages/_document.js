import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <html lang="en">
                <Head>
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                    <title>Krak - Dig deeper into skateboarding</title>
                    <meta name="description" content="" />
                    <meta property="og:title" content="Krak" />
                    <meta property="og:type" content="website" />
                    <meta property="og:description" content="" />
                    <meta property="og:image" content="/static/lucas_background.jpg" />
                    <meta property="og:url" content="https://skatekrak.com" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon-16x16.png" />
                    <link rel="stylesheet" href="/_next/static/style.css" />
                </Head>
                <body
                    style={{
                        backgroundColor: 'black',
                        minHeight: '100vh',
                    }}
                >
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

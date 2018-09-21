import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <link rel="stylesheet" href="/_next/static/style.css" />
          <title>Krakbox</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Few years ago, we launched KRAK, a social network for skateboarders based on a worldwide map of spots." />
        </Head>
        <body style={{
          backgroundColor: "black",
          minHeight: "100vh"
        }}>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
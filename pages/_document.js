import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <html>
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href="/static/images/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/static/images/favicon_32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/static/images/favicon_16.png" />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `var _paq = _paq || [];
                                    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                                    _paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
                                    _paq.push(["setCookieDomain", "*.skatekrak.com"]);
                                    _paq.push(["setDomains", ["*.skatekrak.com","*.krakbox.com"]]);
                                    _paq.push(["enableCrossDomainLinking"]);
                                    _paq.push(['enableHeartBeatTimer']);
                                    _paq.push(['trackPageView']);
                                    _paq.push(['enableLinkTracking']);
                                    (function() {
                                        var u="https://tpc.innocraft.cloud/";
                                        _paq.push(['setTrackerUrl', u+'piwik.php']);
                                        _paq.push(['setSiteId', '2']);
                                        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                                        g.type='text/javascript'; g.async=true; g.defer=true; g.src='//cdn.innocraft.cloud/tpc.innocraft.cloud/piwik.js'; s.parentNode.insertBefore(g,s);
                                    })();`,
                        }}
                    />
                    <noscript>
                        <p>
                            <img
                                src="https://tpc.innocraft.cloud/piwik.php?idsite=2&amp;rec=1"
                                style={{ border: 0 }}
                                alt=""
                            />
                        </p>
                    </noscript>
                    <script src="https://js.stripe.com/v3" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

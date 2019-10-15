import format from 'date-fns/format';
import React from 'react';

const lastMod = format(new Date(), 'yyyy-MM-dd');

const sitemapXml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://skatekrak.com</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
    </url>
    <url>
        <loc>https://skatekrak.com/club</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
    </url>
    <url>
        <loc>https://skatekrak.com/news</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>hourly</changefreq>
    </url>
    <url>
        <loc>https://skatekrak.com/video</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
    </url>
    <url>
        <loc>https://skatekrak.com/auth/login</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
    </url>
    <url>
        <loc>https://mag.skatekrak.com</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>hourly</changefreq>
    </url>
</urlset>`;

export default class Sitemap extends React.Component {
    public static getInitialProps({ res }) {
        res.setHeader('Content-Type', 'text/xml');
        res.write(sitemapXml);
        res.end();
    }
}

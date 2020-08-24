import format from 'date-fns/format';
import React from 'react';

const lastMod = format(new Date(), 'yyyy-MM-dd');
const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;

const sitemapXml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseURL}</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
    </url>
    <url>
        <loc>${baseURL}/club</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
    </url>
    <url>
        <loc>${baseURL}/mag</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>hourly</changefreq>
    </url>
    <url>
        <loc>${baseURL}/news</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>hourly</changefreq>
    </url>
    <url>
        <loc>${baseURL}/video</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
    </url>
    <url>
        <loc>${baseURL}/app</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
    </url>
    <url>
        <loc>${baseURL}/auth/login</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
    </url>
</urlset>`;

export default class Sitemap extends React.Component {
    public static getInitialProps({ res }) {
        res.setHeader('Content-Type', 'text/xml');
        res.write(sitemapXml);
        res.end();
    }
}

import { format } from 'date-fns';
import { GetServerSideProps } from 'next';

const lastMod = format(new Date(), 'yyyy-MM-dd');
const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;

const sitemapXml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseURL}</loc>
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
        <loc>${baseURL}/map</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
    </url>
    <url>
        <loc>${baseURL}/app</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
    </url>
</urlset>`;

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemapXml);
    res.end();

    return { props: {} };
};

export default Sitemap;

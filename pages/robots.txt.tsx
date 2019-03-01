import React from 'react';

const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://skatekrak.com/sitemap.xml`;

export default class Robots extends React.Component {
    public static getInitialProps({ res }) {
        res.setHeader('Content-Type', 'text/plain');
        res.write(robotsTxt);
        res.end();
    }
}

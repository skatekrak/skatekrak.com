import { KrakLoading } from 'components/Ui/Icons/Spinners';
import React from 'react';

const Loading: React.SFC = () => (
    <div key="loader" id="news-articles-loader">
        <KrakLoading />
    </div>
);

export default Loading;

import React from 'react';

import createPropsGetter from 'lib/getProps';

type Props = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> &
    Partial<DefaultProps>;

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    retina: false,
};

const getProps = createPropsGetter(defaultProps);

const Image = (rawProps: Props) => {
    const props = getProps(rawProps);

    if (props.retina) {
        props.srcSet = generateSrcSet(props.src);
    }

    delete props.retina;

    return <img {...props} />;
};

function generateSrcSet(url: string): string {
    const split = url.split('.');
    const extension = split[split.length - 1];
    return url.replace(`.${extension}`, `@2x.${extension}`) + ' 2x';
}

export default Image;

import React, { useEffect, useRef, useState } from 'react';

type Props = {
    src: string | null;
    placeholder: string;
    className?: string;
    children?: React.ReactNode;
};

const BackgroundLoader: React.FC<Props> = ({ src, placeholder, children, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (!src) return;

        const img = document.createElement('img');
        imageRef.current = img;

        img.src = src;
        img.onload = () => setLoaded(true);
        img.onerror = () => setError(true);

        return () => {
            img.onload = null;
            img.onerror = null;
            imageRef.current = null;
        };
    }, [src]);

    const source = !loaded || error ? placeholder : src;

    return (
        <div style={{ backgroundImage: `url("${source}")` }} {...props}>
            {children}
        </div>
    );
};

export default BackgroundLoader;

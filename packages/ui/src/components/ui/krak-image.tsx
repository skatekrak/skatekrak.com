import * as React from 'react';

import { getImgproxyUrl, type ImgproxyOptions } from '@krak/utils';

import { cn } from '@krak/ui/lib/utils';

// ---------------------------------------------------------------------------
// Context — share the imgproxy base URL across the app
// ---------------------------------------------------------------------------

interface ImgproxyContextValue {
    baseUrl: string;
}

const ImgproxyContext = React.createContext<ImgproxyContextValue | null>(null);

function useImgproxy(): ImgproxyContextValue | null {
    return React.useContext(ImgproxyContext);
}

interface ImgproxyProviderProps {
    /** The imgproxy instance base URL (e.g. "https://img.skatekrak.com") */
    baseUrl: string;
    children: React.ReactNode;
}

function ImgproxyProvider({ baseUrl, children }: ImgproxyProviderProps) {
    const value = React.useMemo(() => ({ baseUrl }), [baseUrl]);
    return <ImgproxyContext.Provider value={value}>{children}</ImgproxyContext.Provider>;
}

// ---------------------------------------------------------------------------
// KrakImage — renders an image through imgproxy
// ---------------------------------------------------------------------------

interface KrakImageProps extends Omit<React.ComponentProps<'img'>, 'src'> {
    /** Source path relative to imgproxy (e.g. "maps/custom-maps/abc.png") */
    path: string;
    /** imgproxy processing options (resize, quality, format, etc.) */
    options?: ImgproxyOptions;
}

function KrakImage({ path, options, className, alt = '', loading = 'lazy', ...props }: KrakImageProps) {
    const ctx = useImgproxy();
    if (!ctx) return null;

    const src = getImgproxyUrl(ctx.baseUrl, path, options);

    return <img src={src} alt={alt} loading={loading} className={cn(className)} {...props} />;
}

export { ImgproxyProvider, useImgproxy, KrakImage, type KrakImageProps, type ImgproxyProviderProps };

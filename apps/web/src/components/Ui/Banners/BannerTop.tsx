/*
 * Npm import
 */
import Link from 'next/link';
import React, { useEffect } from 'react';

/*
 * Local import
 */
import ScrollHelper from '@/lib/ScrollHelper';
import { useSettingsStore } from '@/store/settings';

/*
 * Code
 */
type BannerTopProps = {
    offsetScroll: boolean;
    link: string;
    text: string;
};

function BannerTop({ offsetScroll, link, text }: BannerTopProps) {
    const isMobile = useSettingsStore((state) => state.isMobile);

    function handleScroll() {
        const scrollContainer = ScrollHelper.getScrollContainer();
        if (scrollContainer) {
            let showFrom = 0;

            /* Define when to show the banner based on device size */
            if (scrollContainer.id === 'page-container') {
                showFrom = 900;
            } else {
                showFrom = 600;
            }

            const banner = document.getElementById('banner-top');
            if (scrollContainer.scrollTop >= showFrom) {
                banner?.classList.add('banner-top-show');
            } else {
                banner?.classList.remove('banner-top-show');
            }
        }
    }

    useEffect(() => {
        const scrollContainer = ScrollHelper.getScrollContainer();
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }

        const banner = document.getElementById('banner-top');
        if (!offsetScroll) {
            banner?.classList.add('banner-top-show');
        }

        return () => {
            const scrollContainer = ScrollHelper.getScrollContainer();
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isMobile, offsetScroll]);

    return (
        <Link id="banner-top" href={link}>
            {text}
        </Link>
    );
}

export default BannerTop;

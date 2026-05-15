import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';

import { getScrollContainer } from '@/lib/ScrollHelper';

type Props = {
    children?: React.ReactNode;
};

const RefreshScrollOnNewPage: React.FC<Props> = ({ children }) => {
    const router = useRouter();
    const prevPathRef = useRef(router.asPath);

    useEffect(() => {
        if (router.asPath !== prevPathRef.current) {
            getScrollContainer().scrollTop = 0;
            prevPathRef.current = router.asPath;
        }
    }, [router.asPath]);

    return <>{children}</>;
};

export default RefreshScrollOnNewPage;

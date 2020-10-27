import { useRouter } from 'next/router';
import { useMemo } from 'react';

const usePathname = () => {
    const router = useRouter();
    const { pathname } = router;
    return useMemo(() => {
        return pathname;
    }, [pathname]);
};

export default usePathname;

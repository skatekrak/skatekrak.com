import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useSession as useBetterAuthSession } from '@/lib/auth';

type UseSessionOptions = {
    redirectTo?: string;
};

const useSession = ({ redirectTo }: UseSessionOptions = {}) => {
    const router = useRouter();
    const { data: sessionData, isPending, error } = useBetterAuthSession();

    useEffect(() => {
        if (!isPending && !sessionData && redirectTo) {
            router.push(redirectTo);
        }
    }, [isPending, sessionData, router, redirectTo]);

    return {
        data: sessionData,
        isLoading: isPending,
        isSuccess: !!sessionData,
        error: error ?? null,
    };
};

export default useSession;

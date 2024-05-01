import { tryit } from 'radash';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import Feudartifice from '@/shared/feudartifice';
import { useEffect } from 'react';

type UseSessionOptions = {
    redirectTo?: string;
};

const useSession = ({ redirectTo }: UseSessionOptions = {}) => {
    const router = useRouter();

    const { error, ...res } = useQuery({
        queryKey: ['fetch-session'],
        queryFn: async () => {
            const [errorGetSession, sessionRes] = await tryit(Feudartifice.auth.getSession)();
            if (errorGetSession != null) {
                // if (errorGetSession.response?.status === 401) {
                //     if (redirectTo != null) {
                //         router.push(redirectTo);
                //     }
                // }

                throw errorGetSession;
            }

            if (sessionRes == null) {
                throw Error('session appear to be undefined');
            }

            return sessionRes;
        },
        retry: false,
    });

    useEffect(() => {
        if (error) {
            if (redirectTo != null) {
                router.push(redirectTo);
            }
        }
    }, [error, router, redirectTo]);

    return { error, ...res };
};

export default useSession;

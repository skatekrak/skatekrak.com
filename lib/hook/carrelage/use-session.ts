import { tryit } from 'radash';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import Feudartifice from 'shared/feudartifice';

type UseSessionOptions = {
    redirectTo?: string;
};

const useSession = ({ redirectTo }: UseSessionOptions = {}) => {
    const router = useRouter();

    return useQuery(
        ['fetch-session'],
        async () => {
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
        {
            retry: false,
            onError: () => {
                if (redirectTo != null) {
                    router.push(redirectTo);
                }
            },
        },
    );
};

export default useSession;

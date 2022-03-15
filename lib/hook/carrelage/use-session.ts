import to from 'await-to-js';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Feudartifice from 'shared/feudartifice';
import { SessionResponse } from 'shared/feudartifice/auth';
import { CarrelageAPIError } from 'shared/feudartifice/types';

type UseSessionOptions = {
    redirectTo?: string;
};

const useSession = ({ redirectTo }: UseSessionOptions = {}) => {
    const router = useRouter();

    return useQuery(
        ['fetch-session'],
        async () => {
            const [errorGetSession, sessionRes] = await to<SessionResponse, AxiosError<CarrelageAPIError>>(
                Feudartifice.auth.getSession(),
            );

            if (errorGetSession != null) {
                if (errorGetSession.response?.status === 401) {
                    if (redirectTo != null) {
                        router.push(redirectTo);
                    }
                }

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

import { useQuery } from '@tanstack/react-query';

import { getProfileMe } from '../profile';

const useProfileMe = () =>
    useQuery(['fetch-profile', 'me'], () => getProfileMe(), {
        retry: false,
    });

export default useProfileMe;

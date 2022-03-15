import { useQuery } from 'react-query';

import { getProfile } from '../profile';

const useProfile = (id: string) => useQuery(['fetch-profile', id], () => getProfile(id));

export default useProfile;

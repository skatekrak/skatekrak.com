import { useQuery } from '@tanstack/react-query';

import { getProfile } from '../profile';

const useProfile = (id: string) => useQuery({ queryKey: ['fetch-profile', id], queryFn: () => getProfile(id) });

export default useProfile;

import { useQuery } from '@tanstack/react-query';

import { getProfileMe } from '../profile';

const useProfileMe = () => useQuery({ queryKey: ['fetch'], queryFn: () => getProfileMe(), retry: false });

export default useProfileMe;

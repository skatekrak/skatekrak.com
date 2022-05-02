import { useQuery } from 'react-query';

import { getProfileMe } from '../profile';

const useProfileMe = () => useQuery(['fetch-profile'], () => getProfileMe());

export default useProfileMe;

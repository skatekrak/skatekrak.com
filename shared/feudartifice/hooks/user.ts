import { useQuery, UseQueryOptions } from 'react-query';
import Feudartifice from '..';
import { User } from '../types';

export const useUserMe = (options: UseQueryOptions<User> = {}) => {
    return useQuery(['fetch-self'], Feudartifice.user.getUserMe, options);
};

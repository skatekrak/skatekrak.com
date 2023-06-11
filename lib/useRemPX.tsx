import { useMemo } from 'react';

const useRemPX = (rem: string) => {
    return useMemo(() => {
        return parseFloat(rem) * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }, [rem]);
};

export default useRemPX;

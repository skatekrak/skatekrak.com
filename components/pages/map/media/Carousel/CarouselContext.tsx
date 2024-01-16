import { Media, Spot } from 'lib/carrelageClient';
import React, { createContext } from 'react';

type CarouselContextState = {
    media: Media;
    spot: Spot;
};

const CarouselContext = createContext<CarouselContextState | undefined>(undefined);

export const CarouselProvider = ({ children, ...state }: { children: React.ReactNode } & CarouselContextState) => {
    return <CarouselContext.Provider value={state}>{children}</CarouselContext.Provider>;
};

export const useCarouselContext = () => {
    const context = React.useContext(CarouselContext);

    if (context === undefined) {
        throw new Error('useCarouselContext must be used within a CarouselProvider');
    }

    return context;
};

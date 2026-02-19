import React from 'react';

import Carousel, { CarouselProps } from '@/components/pages/map/media/Carousel/Carousel';
import Modal from '@/components/Ui/Modal';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import { modalThemeStyles } from '@/components/Ui/Modal/styles';

type Props = {
    open: boolean;
    onClose: () => void;
    isLoading: boolean;
    carouselProps: CarouselProps;
};

const CarouselModal = ({ open, onClose, isLoading, carouselProps }: Props) => {
    return (
        <Modal open={open} onClose={onClose} closable closeIcon={undefined} styles={modalThemeStyles}>
            <div className="relative flex flex-col min-h-screen h-screen w-screen overflow-hidden laptop-s:min-h-0 laptop-s:h-auto laptop-s:aspect-video laptop-s:w-[88vw] laptop-s:max-w-[80rem]">
                {isLoading ? <KrakLoading /> : <Carousel {...carouselProps} />}
            </div>
        </Modal>
    );
};

export default CarouselModal;

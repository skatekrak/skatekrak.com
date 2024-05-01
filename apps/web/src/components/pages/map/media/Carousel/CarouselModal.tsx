import React from 'react';

import Carousel, { CarouselProps } from '@/components/pages/map/media/Carousel/Carousel';
import Modal from '@/components/Ui/Modal';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import { modalThemeStyles } from '@/components/Ui/Modal/styles';
import * as S from './CarouselModal.styled';

type Props = {
    open: boolean;
    onClose: () => void;
    isLoading: boolean;
    carouselProps: CarouselProps;
};

const CarouselModal = ({ open, onClose, isLoading, carouselProps }: Props) => {
    return (
        <Modal open={open} onClose={onClose} closable closeIcon={undefined} styles={modalThemeStyles}>
            <S.Container>{isLoading ? <KrakLoading /> : <Carousel {...carouselProps} />}</S.Container>
        </Modal>
    );
};

export default CarouselModal;

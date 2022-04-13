import React from 'react';
import { usePortal } from 'shared/feudartifice/hooks/payment';
import * as S from './Header.styled';
import Link from 'next/link';
import IconUserCircle from 'components/Ui/Icons/IconUserCircle';

const HeaderProfile = () => {
    const { data: portal } = usePortal({ retry: 0 });
    // TODO: display user profile picture

    return (
        <Link href={portal?.url ?? '#'} passHref>
            <S.NavItem as="a">
                <IconUserCircle />
            </S.NavItem>
        </Link>
    );
};

export default HeaderProfile;

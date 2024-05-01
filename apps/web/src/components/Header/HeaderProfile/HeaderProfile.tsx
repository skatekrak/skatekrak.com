import React from 'react';

import UserProfilePic from '@/components/Ui/user/UserProfilePic';
import Typography from '@/components/Ui/typography/Typography';
import HeaderProfileMenu from './HeaderProfileMenu/HeaderProfileMenu';
import * as S from './HeaderProfile.styled';

import useProfileMe from '@/shared/feudartifice/hooks/use-profile-me';
import { logout } from '@/shared/feudartifice/auth';
import { useQueryClient } from '@tanstack/react-query';

const HeaderProfile = () => {
    const queryClient = useQueryClient();
    const { data: profile, isLoading } = useProfileMe();

    const handleLogOutClick = async (close: () => void) => {
        await logout();
        close();
        queryClient.setQueryData(['fetch-session'], () => undefined);
        queryClient.invalidateQueries({ queryKey: ['fetch-profile'] });
    };

    if (isLoading || profile == null) {
        return (
            <S.HeaderProfileButton>
                <UserProfilePic size="medium" />
            </S.HeaderProfileButton>
        );
    }

    return (
        <HeaderProfileMenu
            render={({ close }) => (
                <>
                    <S.HeaderProfileMenuUsername component="body2" truncateLines={1}>
                        @ {profile.username}
                    </S.HeaderProfileMenuUsername>
                    <S.HeaderProfileMenuItem onClick={() => handleLogOutClick(close)}>
                        <Typography component="subtitle2">Log out</Typography>
                    </S.HeaderProfileMenuItem>
                </>
            )}
        >
            <S.HeaderProfileButton as="button">
                <S.HeaderProfileContainer>
                    <UserProfilePic src={profile.profilePicture && profile.profilePicture.jpg} size="medium" />
                </S.HeaderProfileContainer>
            </S.HeaderProfileButton>
        </HeaderProfileMenu>
    );
};

export default React.memo(HeaderProfile);

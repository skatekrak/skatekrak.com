import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { offset, shift, useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react';

import UserProfilePic from '@/components/Ui/user/UserProfilePic';
import Typography from '@/components/Ui/typography/Typography';

import useProfileMe from '@/shared/feudartifice/hooks/use-profile-me';
import { logout } from '@/shared/feudartifice/auth';

const HeaderProfile = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const { x, y, strategy, context, refs } = useFloating({
        open: isProfileMenuOpen,
        onOpenChange: setIsProfileMenuOpen,
        placement: 'bottom',
        middleware: [shift(), offset({ mainAxis: 20, crossAxis: -8 })],
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useDismiss(context)]);

    const queryClient = useQueryClient();

    const { data: profile, isLoading } = useProfileMe();

    const handleLogOutClick = async () => {
        await logout();
        setIsProfileMenuOpen(false);
        queryClient.setQueryData(['fetch-session'], () => undefined);
        queryClient.invalidateQueries({ queryKey: ['fetch-profile'] });
    };

    if (isLoading || profile == null) {
        return <UserProfilePic />;
    }

    return (
        <>
            <button {...getReferenceProps({ ref: refs.setReference })}>
                <UserProfilePic src={profile.profilePicture?.jpg} />
            </button>
            {isProfileMenuOpen && (
                <div
                    {...getFloatingProps({
                        ref: refs.setFloating,
                        style: {
                            position: strategy,
                            top: y ?? '',
                            left: x ?? '',
                        },
                    })}
                    className="z-50 flex flex-col gap-2 p-2 max-w-56 rounded border border-tertiary-medium bg-tertiary-dark shadow-onDark-highSharp"
                >
                    <Typography
                        title={profile.username}
                        component="body2"
                        className="p-2 text-onDark-mediumEmphasis"
                        truncateLines={1}
                    >
                        @ {profile.username}
                    </Typography>
                    <button
                        className="w-full py-2 px-4 rounded font-bold text-left hover:bg-tertiary-medium"
                        onClick={() => handleLogOutClick()}
                    >
                        Log out
                    </button>
                </div>
            )}
        </>
    );
};

export default React.memo(HeaderProfile);

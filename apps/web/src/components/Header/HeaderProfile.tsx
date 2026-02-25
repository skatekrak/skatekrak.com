import React, { useState } from 'react';
import {
    useFloating,
    offset,
    flip,
    shift,
    useClick,
    useDismiss,
    useInteractions,
    FloatingPortal,
} from '@floating-ui/react';

import UserProfilePic from '@/components/Ui/user/UserProfilePic';
import Typography from '@/components/Ui/typography/Typography';

import { trpc } from '@/server/trpc/utils';
import { signOut } from '@/lib/auth';

const HeaderProfile = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: isProfileMenuOpen,
        onOpenChange: setIsProfileMenuOpen,
        placement: 'bottom',
        middleware: [offset(4), flip(), shift()],
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

    const { data: profile, isLoading } = trpc.profiles.me.useQuery(undefined, { retry: false });

    const handleLogOutClick = async () => {
        await signOut();
        setIsProfileMenuOpen(false);
    };

    if (isLoading || profile == null) {
        return <UserProfilePic />;
    }

    return (
        <>
            <button ref={refs.setReference} {...getReferenceProps()}>
                <UserProfilePic src={profile.profilePicture?.jpg} />
            </button>
            {isProfileMenuOpen && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className="flex flex-col gap-2 p-2 max-w-56 rounded border border-tertiary-medium bg-tertiary-dark shadow-onDark-highSharp z-[9999]"
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
                            onClick={handleLogOutClick}
                        >
                            Log out
                        </button>
                    </div>
                </FloatingPortal>
            )}
        </>
    );
};

export default React.memo(HeaderProfile);

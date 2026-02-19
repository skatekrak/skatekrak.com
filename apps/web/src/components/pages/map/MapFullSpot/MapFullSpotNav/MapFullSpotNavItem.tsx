import React from 'react';
import classnames from 'classnames';

import Typography from '@/components/Ui/typography/Typography';
import ArrowHead from '@/components/Ui/Icons/ArrowHead';

type MapFullSpotNavItemProps = {
    text: string;
    onClick?: () => void;
    isActive: boolean;
    icon?: React.ReactElement;
};

const MapFullSpotNavItem: React.FC<MapFullSpotNavItemProps> = ({ text, onClick, isActive, icon }) => {
    return (
        <button
            className={classnames(
                'flex items-center w-1/2 uppercase first-of-type:pl-6 last-of-type:pr-6 [&_svg]:w-6 [&_svg]:transition-all [&_svg]:duration-100 hover:[&_svg]:opacity-100 tablet:w-full tablet:py-2 tablet:px-6',
                {
                    'text-onDark-highEmphasis [&_svg]:fill-onDark-highEmphasis': isActive,
                    'text-onDark-mediumEmphasis [&_svg]:fill-onDark-mediumEmphasis': !isActive,
                },
            )}
            onClick={onClick}
        >
            {icon && <div className="w-6 h-6 mr-2 [&_svg]:opacity-100 [&_svg]:ml-0">{icon}</div>}
            <Typography className="tracking-[0.03rem] tablet:mr-auto tablet:text-lg" component="condensedSubtitle1">
                {text}
            </Typography>
            <ArrowHead
                className={classnames('ml-2 tablet:ml-4', {
                    'rotate-90 tablet:rotate-0 tablet:opacity-100': isActive,
                    'rotate-0 tablet:opacity-0': !isActive,
                })}
            />
        </button>
    );
};

export default MapFullSpotNavItem;

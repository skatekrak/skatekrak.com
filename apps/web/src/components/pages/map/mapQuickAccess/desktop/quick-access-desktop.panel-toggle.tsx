import classNames from 'classnames';
import NextImage from 'next/image';
import React, { Ref } from 'react';

import { KrakImage } from '@krak/ui';

import Tooltip from '@/components/Ui/Tooltip';

type Props = {
    ref?: Ref<HTMLDivElement>;
    onClick: () => void;
    selected: boolean;
    isPanelOpen: boolean;
    src?: string;
    imagePath?: string;
    tooltipText: string;
};

const QuickAccessDesktopPanelToggle: React.FC<Props> = React.forwardRef(
    ({ onClick, src, imagePath, tooltipText, selected, isPanelOpen }, ref) => {
        return (
            <div ref={ref}>
                <Tooltip tooltipText={tooltipText}>
                    <button
                        type="button"
                        onClick={onClick}
                        className="relative flex py-1.5 px-3 text-onDark-highEmphasis cursor-pointer"
                    >
                        <div
                            className={classNames('relative size-11', {
                                'after:absolute after:inset-y-0 after:-left-3 after:block after:w-0.5':
                                    selected || isPanelOpen,
                                'after:bg-white/30': isPanelOpen && !selected,
                                'after:bg-primary-80': selected,
                            })}
                        >
                            {imagePath != null ? (
                                <KrakImage
                                    path={imagePath}
                                    options={{ width: 44, height: 44, resizingType: 'fill' }}
                                    alt={tooltipText}
                                    className="block size-11 bg-tertiary-medium border border-solid border-tertiary-light rounded-full"
                                />
                            ) : (
                                <NextImage
                                    fill
                                    src={src ?? ''}
                                    alt={tooltipText}
                                    className="block bg-tertiary-medium border border-solid border-tertiary-light rounded-full"
                                />
                            )}
                        </div>
                    </button>
                </Tooltip>
            </div>
        );
    },
);

QuickAccessDesktopPanelToggle.displayName = 'QuickAccessDesktopPanelToggle';

export default QuickAccessDesktopPanelToggle;

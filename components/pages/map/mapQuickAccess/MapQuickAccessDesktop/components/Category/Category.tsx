import React, { useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import ToggleButton from './ToggleButton';
import Panel from './Panel';

type Props = {
    isSelected: boolean;
    src: string;
    tooltipText: string;
    panelContent: (closePanel: () => void) => JSX.Element;
};

const Category = ({ isSelected, src, tooltipText, panelContent }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Tippy
            visible={isOpen}
            onClickOutside={() => setIsOpen(!isOpen)}
            interactive
            render={() => <Panel isOpen={isOpen}>{panelContent(() => setIsOpen(false))}</Panel>}
        >
            <ToggleButton
                isOpen={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                selected={isSelected}
                src={src}
                tooltipText={tooltipText}
            />
        </Tippy>
    );
};

export default Category;

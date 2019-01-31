/*
 * Npm import
 */
import * as React from 'react';

/*
 * Local import
 */

/*
 * Code
 */
type Props = {
    onClick: (fct: any) => void;
    content: string;
    icon: React.ReactNode;
    actionLabel: string;
};

const ButtonWithLabel: React.SFC<Props> = ({ actionLabel, onClick, content, icon }) => (
    <button className="button-with-label" onClick={onClick}>
        {icon}
        <span className="button-with-label-text">
            <span className="button-with-label-text-action">{actionLabel}&nbsp;</span>
            {content}
        </span>
    </button>
);

/*
 * Export Default
 */
export default ButtonWithLabel;

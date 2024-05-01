import classNames from 'classnames';
import React from 'react';

import IconClipboard from '@/components/Ui/Icons/Clipboard';

type Props = {
    value: string;
};

type State = {
    isCopied: boolean;
};

export default class ClipboardButton extends React.Component<Props, State> {
    public state: State = {
        isCopied: false,
    };

    public render() {
        return (
            <button
                className={classNames('clipboard-button', {
                    'clipboard-button--copied': this.state.isCopied,
                })}
                onClick={this.copyToClipboard}
            >
                <IconClipboard />
                {this.state.isCopied ? 'Copied!' : ''}
            </button>
        );
    }

    private copyToClipboard = () => {
        const el = document.createElement('textarea');
        el.value = this.props.value;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        this.setState({ isCopied: true });
        setTimeout(() => this.setState({ isCopied: false }), 1000);
    };
}

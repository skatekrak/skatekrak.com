import Head from 'next/head';
import React from 'react';

import Link from 'components/Link';
import ModalTwoColumn from 'components/Ui/Modal/twoColumn';

type Props = {
    pricing: string;
    open: boolean;
    onClose: () => void;
};

type State = {
    step: string;
};

const SubscribeHead = () => (
    <Head>
        <title>Krak | Subscribe</title>
        <meta
            name="description"
            content="Krak Skateboarding Club. You're not alone. Let's enjoy skateboarding even more."
        />
        <meta property="og:title" content="Krak Skateboarding Club | Subscribe" />
        <meta property="og:url" content="https://skatekrak.com/club" />
        <meta property="og:image" content="https://skatekrak.com/static/images/og-club.jpg" />
        <meta
            property="og:description"
            content="Krak Skateboarding Club. You're not alone. Let's enjoy skateboarding even more"
        />
    </Head>
);

class SubscribeModal extends React.Component<Props, State> {
    public state: State = {
        step: 'Account',
    };

    public render() {
        const { pricing, open, onClose } = this.props;
        const { step } = this.state;
        return (
            <>
                <SubscribeHead />
                <ModalTwoColumn open={open} onClose={onClose}>
                    Create your account
                    {pricing}
                </ModalTwoColumn>
            </>
        );
    }
}

export default SubscribeModal;

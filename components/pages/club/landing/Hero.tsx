import jump from 'jump.js';
import React from 'react';

import { User } from 'store/auth/reducers';

import Link from 'components/Link';
import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import ScrollHelper from 'lib/ScrollHelper';

type Props = {
    authUser?: User;
    onOpenSubscribeModal: () => void;
};

class Hero extends React.PureComponent<Props, {}> {
    public render() {
        const { authUser, onOpenSubscribeModal } = this.props;

        return (
            <header id="club-hero">
                <h3 id="club-hero-baseline">Dig deeper into skateboarding</h3>
                <img src="/static/images/club/club-hero-logo.svg" alt="Krak skate club" id="club-hero-logo" />
                <h2 id="club-hero-title">
                    Join a global community of international
                    <br />
                    skateboarders exploring the streets
                </h2>
                {authUser ? (
                    <Link href="/club/profile">
                        <a id="club-hero-cta" className="button-primary">
                            Go to my profile
                        </a>
                    </Link>
                ) : (
                    <button id="club-hero-cta" className="button-primary" onClick={onOpenSubscribeModal}>
                        Become a Kraken
                    </button>
                )}
                <button id="club-hero-discover-more" onClick={this.handleAnchorScroll}>
                    Discover more
                    <span id="club-hero-discover-more-arrow">
                        <IconArrowHead />
                    </span>
                </button>
                <div id="club-hero-bg-image-container">
                    <span
                        id="club-hero-bg-image"
                        role="img"
                        aria-label="[Sebo Walker, nollie inward heel. Photo: Amrit Jain]"
                    />
                    <span id="club-hero-bg-image-credits">Sebo Walker, nollie inward heel. Photo: Amrit Jain</span>
                </div>
            </header>
        );
    }

    private handleAnchorScroll = () => {
        const scrollContainer = ScrollHelper.getScrollContainer();
        jump('#club-main', {
            container: scrollContainer,
        });
    };
}

export default Hero;

/*
 * Npm import
 */
import Link from 'next/link';
import React from 'react';
import { connect } from 'react-redux';

/*
 * Local import
 */
import ScrollHelper from 'lib/ScrollHelper';
import { State as SettingState } from 'store/settings/slice';
import { RootState } from 'store';

/*
 * Code
 */
type Props = {
    offsetScroll: boolean;
    link: string;
    text: string;
    settings: SettingState;
};

class BannerTop extends React.Component<Props> {
    public componentDidMount() {
        const scrollContainer = ScrollHelper.getScrollContainer();
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', this.handleScroll);
        }

        const banner = document.getElementById('banner-top');
        if (!this.props.offsetScroll) {
            banner.classList.add('banner-top-show');
        }
    }

    public componentDidUpdate(prevProps: Props) {
        if (prevProps.settings.isMobile !== this.props.settings.isMobile) {
            const scrollContainer = ScrollHelper.getScrollContainer();
            if (scrollContainer) {
                scrollContainer.addEventListener('scroll', this.handleScroll);
            }
        }
    }

    public componentWillUnmount() {
        const scrollContainer = ScrollHelper.getScrollContainer();
        if (scrollContainer) {
            scrollContainer.removeEventListener('scroll', this.handleScroll);
        }
    }

    public render() {
        return (
            <Link id="banner-top" href={this.props.link}>
                {this.props.text}
            </Link>
        );
    }

    private handleScroll = () => {
        const scrollContainer = ScrollHelper.getScrollContainer();
        if (scrollContainer) {
            let showFrom = 0;

            /* Define when to show the banner based on device size */
            if (scrollContainer.id === 'page-container') {
                showFrom = 900;
            } else {
                showFrom = 600;
            }

            const banner = document.getElementById('banner-top');
            if (scrollContainer.scrollTop >= showFrom) {
                banner.classList.add('banner-top-show');
            } else {
                banner.classList.remove('banner-top-show');
            }
        }
    };
}

export default connect((state: RootState) => ({ settings: state.settings }))(BannerTop);

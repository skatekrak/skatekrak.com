/*
 * Npm import
 */
import React from 'react';
import { connect } from 'react-redux';

import Types from 'Types';

/*
 * Local import
 */
import Link from 'components/Link';
import ScrollHelper from 'lib/ScrollHelper';
import { State as SettingState } from 'store/settings/reducers';

/*
 * Code
 */
type Props = {
    settings: SettingState;
};

class BannerTop extends React.Component<Props, {}> {
    public componentDidMount() {
        const scrollContainer = ScrollHelper.getScrollContainer();
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', this.handleScroll);
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
            <Link href="/club">
                <a id="banner-top">Join the club</a>
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
            if (scrollContainer.scrollTop > showFrom) {
                banner.classList.add('banner-top-show');
            } else {
                banner.classList.remove('banner-top-show');
            }
        }
    };
}

export default connect((state: Types.RootState) => ({ settings: state.settings }))(BannerTop);

/* tslint:disable:max-line-length */
/*
 * Npm import
 */
import jump from 'jump.js';
import React from 'react';
import { MapStateToPropsParam, connect } from 'react-redux';

/*
 * Local import
 */
import ScrollHelper from 'lib/ScrollHelper';
import { State as SettingState } from 'store/settings/slice';
import { RootState } from 'store';

/*
 * Code
 */
type OwnProps = {
    elementId: string;
};

type StateProps = {
    settings: SettingState;
};

type Props = OwnProps & StateProps;

class ScrollTop extends React.PureComponent<Props> {
    public componentDidMount() {
        const scrollContainer = ScrollHelper.getScrollContainer();
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', this.handleScroll);
        }
    }

    public componentDidUpdate(prevProps) {
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
            <button id="scroll-top" onClick={this.handleTopClick}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
                    <title>Scroll top</title>
                    <g id="scroll-top-icon" data-name="Scroll top icon">
                        <path
                            d="M46.6,9.4L9.4,47.2c-0.8,0.8-0.8,2,0,2.8l6.9,6.9c0.8,0.8,2,0.8,2.8,0l18.6-18.6c1.3-1.3,3.4-0.4,3.4,1.4V84
                            c0,1.1,0.9,2,2,2h9.7c1.1,0,2-0.9,2-2V39.7c0-1.8,2.2-2.7,3.4-1.4l18.6,18.6c0.8,0.8,2,0.8,2.8,0l6.9-6.9c0.8-0.8,0.8-2,0-2.8
                            L49.4,9.4C48.6,8.7,47.4,8.7,46.6,9.4z"
                        />
                    </g>
                </svg>
            </button>
        );
    }

    private handleScroll = () => {
        const scrollContainer = ScrollHelper.getScrollContainer();
        if (scrollContainer) {
            const { elementId } = this.props;
            const element = document.getElementById(elementId);
            if (element == null) return;

            const elementBottomPos = element.offsetHeight + element.offsetTop;

            const scrollTopButton = document.getElementById('scroll-top');

            if (scrollContainer.scrollTop > elementBottomPos) {
                scrollTopButton?.classList.add('show');
            } else {
                scrollTopButton?.classList.remove('show');
            }
        }
    };

    private handleTopClick = () => {
        const scrollContainer = ScrollHelper.getScrollContainer();
        if (scrollContainer) {
            jump(`#${this.props.elementId}`, {
                offset: -300,
                container: scrollContainer,
            });
        }
    };
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, RootState> = ({ settings }) => {
    return { settings };
};

export default connect<StateProps, Record<string, unknown>, OwnProps, RootState>(mapStateToProps)(ScrollTop);

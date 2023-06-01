import React from 'react';

type Props = {
    src: string;
    placeholder: string;
    className?: string;
    children?: React.ReactNode;
};

type State = {
    loaded: boolean;
    error: boolean;
};

class BackgroundLoader extends React.Component<Props, State> {
    public state: State = {
        loaded: false,
        error: false,
    };

    private image: HTMLImageElement;

    public componentDidMount() {
        if (this.props.src) {
            // Making this a global so it can be later
            // nullified when the component unmounts
            this.image = document.createElement('img');

            this.image.src = this.props.src;
            this.image.onload = this.handleLoad;
            this.image.onerror = this.handleError;
        }
    }

    public shouldComponentUpdate() {
        return !this.state.loaded;
    }

    public componentWillUnmount() {
        if (this.image) {
            this.image.onerror = null;
            this.image.onload = null;
            this.image = null;
        }
    }

    public render() {
        const { src, placeholder, children, ...props } = this.props;
        const source = !this.state.loaded || this.state.error ? placeholder : src;
        return (
            <div style={{ backgroundImage: `url("${source}")` }} {...props}>
                {children}
            </div>
        );
    }

    private handleLoad = () => {
        this.setState({ loaded: true });
    };

    private handleError = () => {
        this.setState({ error: true });
    };
}

export default BackgroundLoader;

import SimpleBar, { Props as SimpleBarProps } from 'simplebar-react';

type Props = {
    maxHeight?: string;
    width?: string;
    children: React.ReactNode;
} & SimpleBarProps;

const ScrollBar = ({ maxHeight, width, children, ...props }: Props) => {
    const styles = {
        maxHeight,
        width,
    };

    return (
        <SimpleBar style={styles} {...props}>
            {children}
        </SimpleBar>
    );
};

export default ScrollBar;

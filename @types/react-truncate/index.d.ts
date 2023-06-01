declare module 'react-truncate' {
    export interface TruncateProps {
        lines?: number | false | undefined;
        ellipsis?: React.ReactNode | undefined;
        trimWhitespace?: boolean | undefined;
        onTruncate?(isTruncated: boolean): void;
    }

    export default class Truncate extends React.Component<TruncateProps & { children: React.ReactNode }> {}
}

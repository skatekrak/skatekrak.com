export default function getPageTitle(path: string): string {
    switch (path) {
        case '/club':
            return 'Club';
        case '/club/subscribe':
            return 'Subscribe';
        case '/club/congrats':
            return 'Congrats';
        default:
            return 'Homepage';
    }
}

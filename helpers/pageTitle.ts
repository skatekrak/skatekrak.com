export default function getPageTitle(path: string): string {
    let name = '';
    switch (path) {
        case '/club':
            name = 'Club';
            break;
        case '/club/subscribe':
            name = 'Subscribe';
            break;
        case '/club/congrats':
            name = 'Congrats';
            break;
        default:
            name = 'Homepage';
            break;
    }
    return name;
}

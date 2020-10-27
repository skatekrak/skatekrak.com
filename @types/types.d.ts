import { RouterState } from 'connected-next-router/types';

declare module 'Types' {
    import { State as FeedState } from 'store/feed/reducers';
    import { State as SettingsState } from 'store/settings/reducers';
    import { MapState } from 'store/map/reducers';

    export type RootState = {
        settings: SettingsState;
        news: FeedState;
        video: FeedState;
        mag: FeedState;
        map: MapState;
        router: RouterState;
    };
}

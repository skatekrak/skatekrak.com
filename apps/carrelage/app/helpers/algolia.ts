import algoliasearch from 'algoliasearch';

import config from '../server/config';

const client = algoliasearch(config.ALGOLIA_APP_ID, config.ALGOLIA_ADMIN_KEY);

export const spotIndex = client.initIndex(`${config.NODE_ENV === 'production' ? 'prod' : 'dev'}_SPOTS`);

export default client;

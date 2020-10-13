import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_API_KEY);

export const spotIndex = client.initIndex('prod_SPOTS');

export default client;

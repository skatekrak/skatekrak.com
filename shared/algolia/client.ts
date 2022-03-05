import algoliasearch from 'algoliasearch/lite';

// TODO: Change before going public :)
const client = algoliasearch('KV1BVE13JQ', '1f13fa7d41ec2b4edcf4c7b4015e3a6d');

export const spotIndex = client.initIndex('prod_SPOTS');

export default client;

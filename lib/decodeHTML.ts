import htmlEntities from 'html-entities';

const Entities = htmlEntities.AllHtmlEntities;
const entities = new Entities();

export default function decodeHTML(str: string) {
    return entities
        .decode(str)
        .replace('<p>', '')
        .replace('</p>', '');
}

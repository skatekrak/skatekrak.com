import XmlEntities from 'lib/XmlEntities';

const entities = new XmlEntities();

export default function decodeHTML(str: string) {
    return entities.decode(str).replace('<p>', '').replace('</p>', '');
}

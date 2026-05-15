import XmlEntities from '@/lib/XmlEntities';

export default function decodeHTML(str: string) {
    return XmlEntities.decode(str).replace('<p>', '').replace('</p>', '');
}

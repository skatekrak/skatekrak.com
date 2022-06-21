import fs from 'fs';
import { join } from 'path';
import { Post } from 'wordpress-types';

const magDirectory = join(process.cwd(), '_mag');

export const getPostSlugs = () => {
    return JSON.parse(fs.readFileSync(join(magDirectory, '_index.json'), 'utf-8'));
};

export const getPostBySlug = (slug: string): Post => {
    const fullPath = join(magDirectory, `${slug}.json`);
    const fileContent = fs.readFileSync(fullPath, 'utf8');

    return JSON.parse(fileContent);
};

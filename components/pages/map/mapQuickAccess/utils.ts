export function generateCustomMapSrcSet(id: string): string {
    return `
        /images/map/custom-maps/${id}.png 1x,
        /images/map/custom-maps/${id}@2x.png 2x,
        /images/map/custom-maps/${id}@3x.png 3x
    `;
}

export function generateCitySrcSet(id: string): string {
    return `
        /images/map/cities/${id}.jpg 1x,
        /images/map/cities/${id}@2x.jpg 2x,
        /images/map/cities/${id}@3x.jpg 3x
    `;
}

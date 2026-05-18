export const deleteSpotAssociatedDataLabels = [
    'spot comments',
    'spot edit history',
    'followers and saved spot links',
    'likes attached directly to the spot',
    'media and clips will be detached from the spot',
];

export function isSpotDeleteConfirmationValid(value: string, spotName: string) {
    return value === spotName;
}

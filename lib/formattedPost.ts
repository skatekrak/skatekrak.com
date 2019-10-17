import { Post } from 'components/pages/mag/Feed';

/**
 * Format the post data from Wordpress to a more readable format
 */
export const formatPost = (post: Post): Post => {
    // Get formated categories
    if (post.categories) {
        const categories = post._embedded['wp:term'][0];
        let formatedCategories = '';
        for (let iCategory = 0; iCategory < categories.length; iCategory++) {
            const categoryName = categories[iCategory].name;
            formatedCategories += categoryName;
            if (iCategory !== categories.length - 1) {
                formatedCategories += ', ';
            }
        }
        post.categoriesString = formatedCategories;
    }

    // Get image
    if (post.featured_media) {
        const sizes = post._embedded['wp:featuredmedia'][0].media_details.sizes;

        if (sizes.medium_large) {
            post.thumbnailImage = sizes.medium_large.source_url;
        } else {
            post.thumbnailImage = sizes.medium.source_url;
        }

        if (sizes.full) {
            post.featuredImageFull = sizes.full.source_url;
        }
    }

    return post;
};

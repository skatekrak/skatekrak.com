import { Post } from 'components/pages/mag/Feed';

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
        // const thumbnailImage = post._embedded['wp:featuredmedia'][0].media_details.sizes.medium_large.source_url;

        const featuredImageFull = post._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url;
        post.featuredImageFull = featuredImageFull;
        post.thumbnailImage = featuredImageFull;
    }

    return post;
};

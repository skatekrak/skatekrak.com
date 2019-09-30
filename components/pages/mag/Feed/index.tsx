import axios from 'axios';
import classNames from 'classnames';
import React from 'react';

import TrackedPage from 'components/pages/TrackedPage';

import Card from 'components/pages/mag/Feed/Card';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
// import ScrollHelper from 'lib/ScrollHelper';

export interface Post {
    id: number;
    title: {
        rendered: string;
    };
    slug: string;
    link: string;
    date: string;
    featured_media: number;
    thumbnailImage: string;
    categories: any[];
    categoriesString: string;
}

type Props = {
    sidebarNavIsOpen: boolean;
};

type State = {
    posts?: Post[];
    isLoading: boolean;
};

class Feed extends React.Component<Props, State> {
    public state: State = {
        posts: [],
        isLoading: false,
    };

    public async componentDidMount() {
        await this.loadMore();
    }

    public render() {
        const { posts, isLoading } = this.state;

        return (
            <div id="mag-feed">
                <TrackedPage name={`Mag/${Math.ceil(posts.length / 20)}`} initial={false} />
                <div className={classNames('row', { hide: this.props.sidebarNavIsOpen })}>
                    {posts.length !== 0 &&
                        posts.map((post) => (
                            <div key={post.id} className="mag-card-container col-xs-12 col-sm-6 col-lg-4">
                                <Card post={post} />
                            </div>
                        ))}
                    {isLoading && <KrakLoading />}
                </div>
            </div>
        );
    }

    private loadMore = async () => {
        this.setState({ isLoading: true });

        try {
            let req: Promise<any>;
            req = axios.get('https://mag.skatekrak.com/wp-json/wp/v2/posts');
            const res = await req;

            if (res.data) {
                const data: Post[] = res.data;
                const formatedPosts = await this.getFormatedPosts(data);
                const posts = this.state.posts;
                this.setState({
                    posts: posts.concat(formatedPosts),
                });
            }
        } catch (err) {
            // console.log(err);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    private getFormatedPosts = async (posts: Post[]) => {
        const formatedPosts = [];

        for (const post of posts) {
            // Get formated categories
            if (post.categories) {
                const categories = post.categories;
                let formatedCategories = '';
                for (let iCategory = 0; iCategory < categories.length; iCategory++) {
                    const res = await axios.get(
                        `https://mag.skatekrak.com/wp-json/wp/v2/categories/${categories[iCategory]}`,
                    );
                    const categoryName = res.data.name;
                    formatedCategories += categoryName;
                    if (iCategory !== categories.length - 1) {
                        formatedCategories += ', ';
                    }
                }
                post.categoriesString = formatedCategories;
            }

            // Get image
            if (post.featured_media) {
                const resMedia = await axios.get(
                    `https://mag.skatekrak.com/wp-json/wp/v2/media/${post.featured_media}`,
                );
                if (resMedia.data.media_details.sizes.medium_large) {
                    const thumbnailImage = resMedia.data.media_details.sizes.medium_large.source_url;
                    post.thumbnailImage = thumbnailImage;
                } else if (resMedia.data.media_details.sizes.medium) {
                    const thumbnailImage = resMedia.data.media_details.sizes.medium.source_url;
                    post.thumbnailImage = thumbnailImage;
                }
            }

            formatedPosts.push(post);
        }

        return formatedPosts;
    };
}

export default Feed;

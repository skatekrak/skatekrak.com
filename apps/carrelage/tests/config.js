const user = {
    username: 'max_menace',
    password: 'chezcattet_m',
    email: 'm@skatekrak.com',
};

const user2 = {
    username: 'jeanpierre',
    password: 'chezcattet_m',
    email: 'jeanpierre@skatekrak.com',
};

const token = '';
const token2 = '';
const tokenAdmin = '';

const tokenUserNotExist = 'Bearer badToken';

const spot = {
    name: 'Krak Office',
    description: "Spot's description",
    latitude: 52.512878,
    longitude: 13.408813,
    type: 'private',
    indoor: false,
};

const spot2 = {
    name: 'Krak Australia Office',
    description: 'Feed Test description',
    latitude: -27.4695848,
    longitude: 153.026208,
    type: 'private',
    indoor: true,
};

const media = {
    caption: 'This a picture media @jeanpierre #krak #1990',
};

const mediaVideo = {
    caption: 'this a video media #krak',
};

const mediaTrickDone = {
    caption: 'Ollie guys!',
    trickDone: {
        trick: 'ollie',
        terrain: 'flatground',
    },
};

const comment = {
    content: 'This is a test comment.',
};

const session = {
    caption: 'Hello World',
    when: new Date(),
};

const likeOnMedia = {};
const likeOnComment = {};
const likeOnClip = {};
const likeOnTrickDone = {};

const trickDone = {
    trick: 'ollie',
    terrain: 'flatground',
};

const trickDoneSwitch = {
    trick: 'ollie',
    stance: 'switch',
    terrain: 'flatground',
    oneFooted: 'north',
    shifty: 'backside',
    bodyVarial: 'frontside',
    grab: 'mute',
};

const clip = {
    url: 'https://www.youtube.com/watch?v=cdghhu3Yj8A',
};

const trick = {
    name: 'ollie',
    displayName: 'Ollie',
    difficultyLevel: 'beginner',
    order: 1,
    keywords: ['ollie', 'jump'],
    points: 10,
};

const learnVideo = {
    url: 'https://www.youtube.com/watch?v=cdghhu3Yj8A',
};

const contest = {
    title: '#yeahgirl',
    description: 'Women, do the best trick on photo',
    reward: 'Your photo exposed at the next YeahGirl exhibition',
    endDate: new Date().setDate(new Date().getDate() + 1),
};

const spotEditFull = {
    name: 'Test Edit',
    longitude: 4.04,
    latitude: 3.03,
    type: 'private',
    status: 'rip',
    description: 'Test description',
    indoor: true,
    phone: '+3311111111',
    website: 'https://skatekrak.com',
    instagram: '@skate_krak',
    snapchat: '@skatekrak',
    facebook: 'skatekrak',
};

const spotEditSmall = {
    status: 'rip',
};

export default {
    user,
    user2,
    token,
    token2,
    tokenAdmin,
    tokenUserNotExist,
    spot,
    spot2,
    media,
    mediaVideo,
    mediaTrickDone,
    comment,
    session,
    likeOnMedia,
    likeOnComment,
    likeOnClip,
    likeOnTrickDone,
    trickDone,
    trickDoneSwitch,
    clip,
    trick,
    learnVideo,
    contest,
    spotEditFull,
    spotEditSmall,
};

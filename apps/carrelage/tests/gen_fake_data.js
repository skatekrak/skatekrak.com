/* eslint no-await-in-loop: off */

import { subDays } from 'date-fns';
import mongoose from 'mongoose';
import request from 'supertest';
import Chance from 'chance';

import app, { ready } from '../app/server';
import config from '../app/server/config';

const chance = new Chance();

const NB_USERS = 20;
const NB_RAND_ITEM = 100;
// const NB_SESSIONS_WITH_MAX = 4;
const NB_LIKES_MAX = NB_USERS / 2;
const NB_COMMENTS_MAX = NB_USERS / 4;

before((done) => {
    ready.then(done);
});

after((done) => {
    // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.connection.close();
    done();
});

const users = [];
const spots = [];
const tricks = [];

function getStancesSupported(trick) {
    const stances = ['regular'];
    if (trick.fakie) {
        stances.push('fakie');
    }

    if (trick.switch) {
        stances.push('switch');
    }

    if (trick.nollie) {
        stances.push('nollie');
    }
    return stances;
}

describe('Create Fake Users', () => {
    it(`should create ${NB_USERS} Users`, async () => {
        for (let i = 0; i < NB_USERS; i += 1) {
            const res = await request(app)
                .post('/auth/signup')
                .send({
                    username: `fakekrak${i}`,
                    email: chance.email(),
                    password: 'fakekrak',
                });
            users.push({
                token: res.body.token,
                user: res.body.user,
            });
        }
    });

    it('should populate fake datas in Profiles', async () => {
        for (const user of users) {
            const res = await request(app)
                .put(`/profiles/${user.user.username}`)
                .set('Authorization', user.token)
                .send({
                    stance: chance.pickone(['regular', 'goofy']),
                    snapchat: chance.twitter(),
                    instagram: chance.twitter(),
                    location: `${chance.city()}, ${chance.country()}`,
                    sponsors: [chance.company(), chance.company(), chance.company()],
                    website: chance.url({ path: '' }),
                    description: chance.sentence({ words: 5 }),
                });
            const copy = user;
            copy.profile = res.body;
        }
    });

    it('should upload profile pic & banner', async () => {
        for (const user of users) {
            await request(app)
                .put(`/profiles/${user.user.username}/upload/profile`)
                .set('Authorization', user.token)
                .attach('file', './tests/files/pic.jpg');
            const banner = await request(app)
                .put(`/profiles/${user.user.username}/upload/banner`)
                .set('Authorization', user.token)
                .attach('file', './tests/files/banner.jpg');
            const copy = user;
            copy.profile = banner.body;
        }
    });

    it('should create random profile follows', async () => {
        for (const user of users) {
            const rand = chance.integer({ min: 0, max: users.length / 2 });
            for (let i = 0; i < rand; i += 1) {
                await request(app)
                    .post(`/profiles/${chance.pickone(users).user.username}/follow`)
                    .set('Authorization', user.token);
            }
        }
    });
});

// describe('Import tricks from Airtable', () => {
//     it('should import tricks from Airtable', async () => {
//         await request(app)
//             .post('/admin/import-tricks')
//             .set('Authorization', `Bearer ${config.ROOT_TOKEN}`)
//             .send({ formula: 'IF(Points, TRUE(), FALSE())' });
//     });

//     it('should get all tricks', async () => {
//         const res = await request(app)
//             .get('/tricks')
//             .set('Authorization', `Bearer ${config.ROOT_TOKEN}`);
//         tricks.push(...res.body);
//     });
// });

function pastMonthRandomDate() {
    const now = new Date();
    const start = subDays(now, 30);
    const diff = now - start.getTime();
    const rand = Math.random() * diff;
    return new Date(start.getTime() + rand).toISOString();
}

function createSpot() {
    let spot;

    it('should create a spot', async () => {
        let res;
        do {
            res = await request(app)
                .post('/spots')
                .set('Authorization', chance.pickone(users).token)
                .send({
                    createdAt: pastMonthRandomDate(),
                    name: chance.sentence({ words: 2 }),
                    latitude: chance.latitude({ min: 39.281815, max: 54.723413 }),
                    longitude: chance.longitude({ min: -6.878065, max: 22.249512 }),
                    type: chance.pickone(['private', 'shop', 'diy', 'street', 'park']),
                    status: chance.pickone(['wip', 'rip', 'active']),
                    phone: chance.phone(),
                    website: chance.url({ path: '' }),
                    snapchat: chance.twitter(),
                    instagram: chance.twitter(),
                    facebook: chance.twitter(),
                    description: chance.sentence({ words: 10 }),
                    indoor: chance.pickone([true, false]),
                });
        } while (res.statusCode !== 200);
        spot = res.body;
        spots.push(res.body);
    });

    it('should create random spot follows', async () => {
        for (const user of users) {
            const rand = chance.bool();
            if (rand) {
                await request(app)
                    .post(`/spots/${spot.id}/follow`)
                    .set('Authorization', user.token);
            }
        }
    });

    it('should create random spot comments w/ likes', async () => {
        const rand = chance.integer({ min: 0, max: NB_COMMENTS_MAX });
        for (let i = 0; i < rand; i += 1) {
            const com = await request(app)
                .post(`/spots/${spot.id}/comments`)
                .set('Authorization', chance.pickone(users).token)
                .send({
                    content: `${chance.sentence({ words: 10 })} \n
                    ${chance.hashtag()} ${chance.hashtag()} \n
                    @${chance.pickone(users).user.username} @${chance.pickone(users).user.username}`,
                });

            const count = chance.integer({ min: 0, max: NB_LIKES_MAX });
            for (let j = 0; j < count; j += 1) {
                await request(app)
                    .post(`/spots/${spot.id}/comments/${com.body.id}/likes`)
                    .set('Authorization', chance.pickone(users).token);
            }
        }
    });
}

function createMedia() {
    let media;

    it('should create a media', async () => {
        const rand = chance.pickone(users).token;
        const json = {
            createdAt: pastMonthRandomDate(),
            caption: `${chance.sentence({ words: 10 })} \n
            ${chance.hashtag()} ${chance.hashtag()} \n
            @${chance.pickone(users).user.username} @${chance.pickone(users).user.username}`,
            spot: chance.pickone(spots).id,
        };
        if (chance.bool()) {
            const trick = chance.pickone(tricks);
            json.trickDone = {
                trick: trick.id,
                stance: chance.pickone(getStancesSupported(trick)),
                terrain: chance.pickone(trick.terrains),
            };
        }
        const res = await request(app)
            .post('/medias')
            .set('Authorization', rand)
            .send(json);

        const isPhoto = chance.bool({ likelihood: 75 });
        let up;
        if (isPhoto) {
            up = await request(app)
                .put(`/medias/${res.body.id}/upload`)
                .set('Authorization', rand)
                .attach('file', './tests/files/media.jpg');
        } else {
            up = await request(app)
                .put(`/medias/${res.body.id}/upload`)
                .set('Authorization', rand)
                .attach('file', './tests/files/video.m4v');
        }
        if (up.body.id) {
            media = up.body;
        }
    });

    it('should create random media likes', async () => {
        if (media) {
            const rand = chance.integer({ min: 0, max: NB_LIKES_MAX });
            for (let i = 0; i < rand; i += 1) {
                await request(app)
                    .post(`/medias/${media.id}/likes`)
                    .set('Authorization', chance.pickone(users).token);
            }
        }
    });

    it('should create random media comments', async () => {
        if (media) {
            const rand = chance.integer({ min: 0, max: NB_COMMENTS_MAX });
            for (let i = 0; i < rand; i += 1) {
                const com = await request(app)
                    .post(`/medias/${media.id}/comments`)
                    .set('Authorization', chance.pickone(users).token)
                    .send({
                        content: `${chance.sentence({ words: 10 })} \n
                    ${chance.hashtag()} ${chance.hashtag()} \n
                    @${chance.pickone(users).user.username} @${chance.pickone(users).user.username}`,
                    });

                const count = chance.integer({ min: 0, max: NB_LIKES_MAX });
                for (let j = 0; j < count; j += 1) {
                    await request(app)
                        .post(`/medias/${media.id}/comments/${com.body.id}/likes`)
                        .set('Authorization', chance.pickone(users).token);
                }
            }
        }
    });

    it('should create random media trickDone likes', async () => {
        if (media.trickDone) {
            const { trickDone } = media;

            const rand = chance.integer({ min: 0, max: NB_LIKES_MAX });
            for (let i = 0; i < rand; i += 1) {
                await request(app)
                    .post(`/tricks-done/${trickDone.id}/likes`)
                    .set('Authorization', chance.pickone(users).token);
            }
        }
    });

    it('should create random media trickDone comments', async () => {
        if (media.trickDone) {
            const { trickDone } = media;

            const rand = chance.integer({ min: 0, max: NB_COMMENTS_MAX });
            for (let i = 0; i < rand; i += 1) {
                const com = await request(app)
                    .post(`/tricks-done/${trickDone.id}/comments`)
                    .set('Authorization', chance.pickone(users).token)
                    .send({
                        content: `${chance.sentence({ words: 10 })} \n
                        ${chance.hashtag()} ${chance.hashtag()} \n
                        @${chance.pickone(users).user.username} @${chance.pickone(users).user.username}`,
                    });

                const count = chance.integer({ min: 0, max: NB_LIKES_MAX });
                for (let j = 0; j < count; j += 1) {
                    await request(app)
                        .post(`/tricks-done/${trickDone.id}/comments/${com.body.id}/likes`)
                        .set('Authorization', chance.pickone(users).token);
                }
            }
        }
    });
}

function createClip() {
    let clip;

    it('should create a clip', async () => {
        const res = await request(app)
            .post('/clips')
            .set('Authorization', chance.pickone(users).token)
            .send({
                createdAt: pastMonthRandomDate(),
                url: chance.pickone(['https://www.youtube.com/watch?v=cdghhu3Yj8A', 'https://vimeo.com/207691184']),
                spot: chance.pickone(spots).id,
            });
        clip = res.body;
    });

    it('should create random clip likes', async () => {
        const rand = chance.integer({ min: 0, max: NB_LIKES_MAX });
        for (let i = 0; i < rand; i += 1) {
            await request(app)
                .post(`/clips/${clip.id}/likes`)
                .set('Authorization', chance.pickone(users).token);
        }
    });

    it('should create random clip comments', async () => {
        const rand = chance.integer({ min: 0, max: NB_COMMENTS_MAX });
        for (let i = 0; i < rand; i += 1) {
            const com = await request(app)
                .post(`/clips/${clip.id}/comments`)
                .set('Authorization', chance.pickone(users).token)
                .send({
                    content: `${chance.sentence({ words: 10 })} \n
                    ${chance.hashtag()} ${chance.hashtag()} \n
                    @${chance.pickone(users).user.username} @${chance.pickone(users).user.username}`,
                });

            const count = chance.integer({ min: 0, max: NB_LIKES_MAX });
            for (let j = 0; j < count; j += 1) {
                await request(app)
                    .post(`/clips/${clip.id}/comments/${com.body.id}/likes`)
                    .set('Authorization', chance.pickone(users).token);
            }
        }
    });
}

// function createSession() {
//     let session;

//     it('should create a session', async () => {
//         const sessionWith = [];
//         const rand = chance.integer({ min: 0, max: NB_SESSIONS_WITH_MAX });
//         for (let j = 0; j < rand; j += 1) {
//             sessionWith.push(chance.pickone(users).user.username);
//         }
//         const res = await request(app)
//             .post('/sessions')
//             .set('Authorization', chance.pickone(users).token)
//             .send({
//                  createdAt: pastMonthRandomDate(),
//                 caption: `${chance.sentence({ words: 10 })} \n ${chance.hashtag()} ${chance.hashtag()}`,
//                 spots: [chance.pickone(spots).id],
//                 with: sessionWith,
//                 when: chance.date({ year: 2018 }),
//             });
//         session = res.body;
//     });

//     it('should create random session likes', async () => {
//         const rand = chance.integer({ min: 0, max: NB_LIKES_MAX });
//         for (let i = 0; i < rand; i += 1) {
//             await request(app)
//                 .post(`/sessions/${session.id}/likes`)
//                 .set('Authorization', chance.pickone(users).token);
//         }
//     });

//     it('should create random session comments', async () => {
//         const rand = chance.integer({ min: 0, max: NB_COMMENTS_MAX });
//         for (let i = 0; i < rand; i += 1) {
//             const com = await request(app)
//                 .post(`/sessions/${session.id}/comments`)
//                 .set('Authorization', chance.pickone(users).token)
//                 .send({
//                     content: `${chance.sentence({ words: 10 })} \n
//                     ${chance.hashtag()} ${chance.hashtag()} \n
//                     @${chance.pickone(users).user.username} @${chance.pickone(users).user.username}`,
//                 });

//             const count = chance.integer({ min: 0, max: NB_LIKES_MAX });
//             for (let j = 0; j < count; j += 1) {
//                 await request(app)
//                     .post(`/sessions/${session.id}/comments/${com.body.id}/likes`)
//                     .set('Authorization', chance.pickone(users).token);
//             }
//         }
//     });
// }

function createTrickDone() {
    let trickDone;

    it('should create a trickDone', async () => {
        const trick = chance.pickone(tricks);
        const json = {
            createdAt: pastMonthRandomDate(),
            trick: trick.id,
            spot: chance.pickone(spots).id,
            stance: chance.pickone(getStancesSupported(trick)),
            terrain: chance.pickone(trick.terrains),
        };
        const res = await request(app)
            .post('/tricks-done')
            .set('Authorization', chance.pickone(users).token)
            .send(json);
        trickDone = res.body;
    });

    it('should create random trickDone likes', async () => {
        const rand = chance.integer({ min: 0, max: NB_LIKES_MAX });
        for (let i = 0; i < rand; i += 1) {
            await request(app)
                .post(`/tricks-done/${trickDone.id}/likes`)
                .set('Authorization', chance.pickone(users).token);
        }
    });

    it('should create random trickDone comments', async () => {
        const rand = chance.integer({ min: 0, max: NB_COMMENTS_MAX });
        for (let i = 0; i < rand; i += 1) {
            const com = await request(app)
                .post(`/tricks-done/${trickDone.id}/comments`)
                .set('Authorization', chance.pickone(users).token)
                .send({
                    content: `${chance.sentence({ words: 10 })} \n
                    ${chance.hashtag()} ${chance.hashtag()} \n
                    @${chance.pickone(users).user.username} @${chance.pickone(users).user.username}`,
                });

            const count = chance.integer({ min: 0, max: NB_LIKES_MAX });
            for (let j = 0; j < count; j += 1) {
                await request(app)
                    .post(`/tricks-done/${trickDone.id}/comments/${com.body.id}/likes`)
                    .set('Authorization', chance.pickone(users).token);
            }
        }
    });
}

describe('Create Fake Datas', () => {
    createSpot();
    for (let i = 0; i < NB_RAND_ITEM; i += 1) {
        const creator = chance.pickone([
            createMedia,
            createMedia,
            createMedia,
            createMedia,
            createSpot,
            createSpot,
            // createTrickDone,
            // createTrickDone,
            createClip,
            // createSession,
            // createSession,
        ]);
        creator();
    }
});

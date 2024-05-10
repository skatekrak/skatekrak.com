import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

const context = {
    spot: {
        name: 'Test spot to merge',
        description: 'This is a spot that will be merged',
        latitude: -27.4695848,
        longitude: 153.026208,
        type: 'street',
        indoor: false,
    },
    comment: {
        content: 'This is a comment which will merge into another spot',
    },
    media: {
        caption: 'This is a media which will merge into another spot',
    },
    clip: {
        url: 'https://www.youtube.com/watch?v=cdghhu3Yj8A',
    },
    session: {
        caption: 'This is a sessions which will be merge into another spot',
        when: new Date(),
    },
    spotEditMerge: {},
};

describe('Create Spot Edit for Merge', () => {
    describe('Prepare Context for testing purpose', () => {
        it('should create the spot to merge', (done) => {
            request(app)
                .post('/spots')
                .send(context.spot)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    context.spot = res.body;
                    done();
                })
                .catch(done);
        });

        it('should create a comment on the spot to merge', (done) => {
            request(app)
                .post(`/spots/${context.spot.id}/comments`)
                .send(context.comment)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body: comment } = res;
                    expect(comment.addedBy).to.equal(config.user.id);
                    expect(comment.content).to.equal(context.comment.content);
                    context.comment = comment;
                    done();
                })
                .catch(done);
        });

        it('should create a media on the spot to merge', (done) => {
            context.media.spot = context.spot.id;
            request(app)
                .post('/medias')
                .send(context.media)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    context.media = res.body;
                    done();
                })
                .catch(done);
        });

        it('should upload a media picture on the media of the spot to merge', (done) => {
            request(app)
                .put(`/medias/${context.media.id}/upload`)
                .attach('file', './tests/files/media.jpg')
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    context.media = res.body;
                    done();
                })
                .catch(done);
        });

        it('should create a clip on the spot to merge', (done) => {
            context.clip.spot = context.spot.id;
            request(app)
                .post('/clips')
                .send(context.clip)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    context.clip = res.body;
                    done();
                })
                .catch(done);
        });

        it('should create a session on the spot to merge', (done) => {
            const { session } = context;
            session.spots = [context.spot.id];
            session.with = [config.user2.id];
            request(app)
                .post('/sessions')
                .send(session)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    context.session = res.body;
                    done();
                })
                .catch(done);
        });

        it('user2 should follow the created spot', (done) => {
            request(app)
                .get(`/profiles/${config.user2.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body } = res;

                    expect(body.spotsFollowing).to.be.an('array');
                    expect(body.spotsFollowing).to.have.lengthOf(1);
                    expect(body.spotsFollowing[0].id).to.equal(context.spot.id);

                    done();
                })
                .catch(done);
        });
    });

    describe('POST /spots/:id/edits', () => {
        it('should failed if mergeInto is not an ObjectId', (done) => {
            request(app)
                .post(`/spots/${context.spot.id}/edits`)
                .send({ mergeInto: 'blabla' })
                .set('Authorization', config.token)
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });

        it('should failed if mergeInto is the same than the spot', (done) => {
            request(app)
                .post(`/spots/${context.spot.id}/edits`)
                .send({ mergeInto: context.spot.id })
                .set('Authorization', config.token)
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });

        it('should failed if mergeInto does not exist', (done) => {
            request(app)
                .post(`/spots/${context.spot.id}/edits`)
                .send({ mergeInto: '5b0c0d88394cae0012793bc3' })
                .set('Authorization', config.token)
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });

        it('should create a merging spot edit into spot', (done) => {
            request(app)
                .post(`/spots/${context.spot.id}/edits`)
                .send({ mergeInto: config.spot.id })
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body } = res;

                    expect(body.addedBy).to.equal(config.user2.id);
                    expect(body.mergeInto).to.equal(config.spot.id);

                    context.spotEditMerge = body;
                    done();
                })
                .catch(done);
        });
    });

    describe('PUT /spots/:spotId?editId=:editId', () => {
        it('should be Forbidden because you are not the spot creator', (done) => {
            request(app)
                .put(`/spots/${context.spot.id}`)
                .query({ editId: context.spotEditMerge.id })
                .set('Authorization', config.token)
                .expect(httpStatus.FORBIDDEN)
                .then(() => done())
                .catch(done);
        });

        it('should merge the context spot into spot', (done) => {
            request(app)
                .put(`/spots/${context.spot.id}`)
                .query({ editId: context.spotEditMerge.id })
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body: merged } = res;
                    expect(merged.id).to.equal(config.spot.id);
                    done();
                })
                .catch(done);
        });

        it('should check the old spot does not exist anymore', (done) => {
            request(app)
                .get(`/spots/${context.spot.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.NOT_FOUND)
                .then(() => done())
                .catch(done);
        });

        it('should check the comment has been copied to the spot', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body: spot } = res;
                    expect(spot.comments).to.shallowDeepEqual([{ id: context.comment.id }]);
                    done();
                })
                .catch(done);
        });

        it('should check the profile follow spot and not the old spot anymore', (done) => {
            request(app)
                .get(`/profiles/${config.user2.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body: profile } = res;
                    expect(profile.spotsFollowing).to.shallowDeepEqual([{ id: config.spot.id }]);
                    expect(profile.spotsFollowing).to.not.shallowDeepEqual([{ id: context.spot.id }]);
                    done();
                })
                .catch(done);
        });

        it('should check the media have been updated to the spot', (done) => {
            request(app)
                .get(`/medias/${context.media.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body: media } = res;
                    expect(media.spot).to.include({ id: config.spot.id });
                    done();
                })
                .catch(done);
        });

        it('should check the clip have been updated to the spot', (done) => {
            request(app)
                .get(`/clips/${context.clip.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body: clip } = res;
                    expect(clip.spot).to.include({ id: config.spot.id });
                    done();
                })
                .catch(done);
        });

        it('should check the session have been updated to the spot', (done) => {
            request(app)
                .get(`/sessions/${context.session.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body: session } = res;
                    expect(session.spots).to.shallowDeepEqual([{ id: config.spot.id }]);
                    done();
                })
                .catch(done);
        });
    });

    describe('Check that Spot counters are correct after merging', () => {
        it('should get correct spot statistics for spot', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body: spot } = res;
                    expect(spot.mediasStat.all).to.equal(3);
                    expect(spot.mediasStat.daily).to.equal(3);
                    expect(spot.clipsStat.all).to.equal(2);
                    expect(spot.clipsStat.daily).to.equal(2);
                    expect(spot.tricksDoneStat.all).to.equal(1);
                    expect(spot.tricksDoneStat.daily).to.equal(1);
                    done();
                })
                .catch(done);
        });
    });

    describe('Clean Context after spot merging testing', () => {
        it('should delete merged media', (done) => {
            request(app)
                .delete(`/medias/${context.media.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then(() => done())
                .catch(done);
        });

        it('should delete merged clip', (done) => {
            request(app)
                .delete(`/clips/${context.clip.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then(() => done())
                .catch(done);
        });

        it('should delete merged session', (done) => {
            request(app)
                .delete(`/sessions/${context.session.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then(() => done())
                .catch(done);
        });
    });
});

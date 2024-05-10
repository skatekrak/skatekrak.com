import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Trick Wishlist API', () => {
    let trickWish = {
        terrain: 'flatground',
        trick: 'ollie',
    };

    let trickWishFakie = {
        terrain: 'flatground',
        trick: 'ollie',
        stance: 'fakie',
        amountWanted: 10,
    };

    describe('POST /profiles/:userId/trick-wishlist', () => {
        it('should create a trick in the wishlist', (done) => {
            request(app)
                .post(`/profiles/${config.user.id}/tricks-wishlist`)
                .send(trickWish)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.trick.id).to.equal(trickWish.trick);
                    expect(res.body.terrain).to.equal(trickWish.terrain);
                    expect(res.body.stance).to.equal('regular');
                    expect(res.body.amountWanted).to.equal(1);
                    expect(res.body.currentlyDone).to.equal(0);
                    expect(res.body.id).to.equal(`${trickWish.terrain}_regular_${trickWish.trick}`);
                    trickWish = res.body;
                    done();
                })
                .catch(done);
        });

        it('should report NOT_ACCEPTABLE to create the same trick in the wishlist', (done) => {
            request(app)
                .post(`/profiles/${config.user.id}/tricks-wishlist`)
                .send({
                    terrain: 'flatground',
                    trick: 'ollie',
                })
                .set('Authorization', config.token)
                .expect(httpStatus.NOT_ACCEPTABLE)
                .then(() => done())
                .catch(done);
        });

        it('should create a second trick', (done) => {
            request(app)
                .post(`/profiles/${config.user.id}/tricks-wishlist`)
                .send(trickWishFakie)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.trick.id).to.equal(trickWishFakie.trick);
                    expect(res.body.terrain).to.equal(trickWishFakie.terrain);
                    expect(res.body.stance).to.equal(trickWishFakie.stance);
                    expect(res.body.amountWanted).to.equal(10);
                    expect(res.body.currentlyDone).to.equal(0);
                    expect(res.body.id).to.equal(
                        `${trickWishFakie.terrain}_${trickWishFakie.stance}_${trickWishFakie.trick}`,
                    );
                    trickWishFakie = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('PATCH /profiles/:userId/tricks-wishlist/:trickWishId', () => {
        it('should update the trick amountWanted', (done) => {
            request(app)
                .patch(`/profiles/${config.user.id}/tricks-wishlist/${trickWish.id}`)
                .send({
                    amountWanted: 10,
                })
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(trickWish.id);
                    expect(res.body.amountWanted).to.equal(10);
                    done();
                })
                .catch(done);
        });
    });

    describe('DELETE /profiles/:userId/tricks-wishlist/:trickWishId', () => {
        it('should delete the regular trick created', (done) => {
            request(app)
                .delete(`/profiles/${config.user.id}/tricks-wishlist/${trickWish.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then(() => done())
                .catch(done);
        });
    });

    describe('DELETE /profiles/:userId/tricks-wish/', () => {
        it('should delete all the tricks in the wishlist', (done) => {
            request(app)
                .delete(`/profiles/${config.user.id}/tricks-wishlist`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then(() => done())
                .catch(done);
        });
    });

    describe('GET /profiles/:userId', () => {
        it('should the get the profile to check if the wishlist is properly empty', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.tricksWishlist).to.be.an('array');
                    expect(res.body.tricksWishlist).to.have.length(0);
                    done();
                })
                .catch(done);
        });
    });
});

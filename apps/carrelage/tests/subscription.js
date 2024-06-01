import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';
import { SubscriptionStatus } from '../app/models/user';

describe('Check payment required on routes', () => {
    describe('POST /admin/update-subscription', () => {
        it('should change the user subscription status to active without an end date', (done) => {
            request(app)
                .post('/admin/update-subscription')
                .set('Authorization', config.tokenAdmin)
                .send({
                    userId: config.user.id,
                    status: SubscriptionStatus.Active,
                })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user.id);
                    expect(res.body.username).to.equal(config.user.username);
                    expect(res.body.subscriptionStatus).to.equal(SubscriptionStatus.Active);
                    expect(res.body.subscriptionEndAt).to.not.exist;
                    done();
                })
                .catch(done);
        });

        it('should change the user2 subscription status to active without an end date', (done) => {
            request(app)
                .post('/admin/update-subscription')
                .set('Authorization', config.tokenAdmin)
                .send({
                    userId: config.user2.id,
                    status: SubscriptionStatus.Active,
                })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user2.id);
                    expect(res.body.username).to.equal(config.user2.username);
                    expect(res.body.subscriptionStatus).to.equal(SubscriptionStatus.Active);
                    expect(res.body.subscriptionEndAt).to.not.exist;
                    done();
                })
                .catch(done);
        });
    });
});

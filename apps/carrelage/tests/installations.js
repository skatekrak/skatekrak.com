import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Installations API', () => {
    let installation = {
        deviceToken: 'this_is_a_token',
        locale: 'fr-FR',
        deviceType: 'ios',
        version: '3.9',
        timezone: 'Australia/Brisbane',
        channels: ['contests', 'krakbox'],
    };

    describe('POST /users/:userId/installations', () => {
        it('should create a new installation', (done) => {
            request(app)
                .post(`/users/${config.user.id}/installations`)
                .send(installation)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.deviceToken).to.equal(installation.deviceToken);
                    expect(res.body.localeIdentifier).to.equal(installation.locale);
                    expect(res.body.deviceType).to.equal(installation.deviceType);
                    expect(res.body.version).to.equal(installation.version);
                    expect(res.body.timezone).to.equal(installation.timezone);
                    expect(res.body.channels).to.be.an('array');
                    installation = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /users/:userId/installations/:installationId', () => {
        it('should get the previously created installation', (done) => {
            request(app)
                .get(`/users/${config.user.id}/installations/${installation.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.deviceToken).to.equal(installation.deviceToken);
                    expect(res.body.localeIdentifier).to.equal(installation.localeIdentifier);
                    expect(res.body.deviceType).to.equal(installation.deviceType);
                    expect(res.body.version).to.equal(installation.version);
                    expect(res.body.timezone).to.equal(installation.timezone);
                    expect(res.body.channels).to.be.an('array');
                    done();
                })
                .catch(done);
        });
    });

    describe('PATCH /users/:userId/installations/:installationId', () => {
        it('should update the installation', (done) => {
            request(app)
                .patch(`/users/${config.user.id}/installations/${installation.id}`)
                .send({
                    timezone: 'Europe/Paris',
                    locale: 'en-EN',
                    version: '4.0',
                    channels: ['update', 'pro'],
                })
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.deviceToken).to.equal(installation.deviceToken);
                    expect(res.body.localeIdentifier).to.equal('en-EN');
                    expect(res.body.timezone).to.equal('Europe/Paris');
                    expect(res.body.version).to.equal('4.0');
                    expect(res.body.channels).to.be.an('array');
                    expect(res.body.deviceType).to.equal(installation.deviceType);
                    installation = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('DELETE /users/:userId/installations/:installationId', () => {
        it('should delete the installation', (done) => {
            request(app)
                .delete(`/users/${config.user.id}/installations/${installation.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.deviceToken).to.equal(installation.deviceToken);
                    expect(res.body.localeIdentifier).to.equal(installation.localeIdentifier);
                    expect(res.body.deviceType).to.equal(installation.deviceType);
                    expect(res.body.version).to.equal(installation.version);
                    expect(res.body.timezone).to.equal(installation.timezone);
                    expect(res.body.channels).to.be.an('array');
                    done();
                })
                .catch(done);
        });
    });
});

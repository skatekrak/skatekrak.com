import mongoose from 'mongoose';
import chai from 'chai';
import shallowDeepEqual from 'chai-shallow-deep-equal';

import { ready } from '../app/server';

import './misc';
import './create_user';
import './auth';
import './admin';
import './subscription';
import './installations';
import './gears';
import './follow';
import './feedbacks';
import './create_spot';
import './create_spot_edit';
import './create_tricks';
import './trick_wishlist';
import './create_trick_done';
import './create_media';
import './create_clip';
import './create_learn-videos';
import './create_comment';
import './create_session';
import './create_like';
import './create_contest';
import './profile_counters';
import './spot_counters';
import './feeds';
import './content_from_profile';
import './content_from_spot';
import './spot_edit_merge';
import './rename';
import './delete_contest';
import './delete_like';
import './delete_session';
import './delete_comment';
import './delete_clip';
import './delete_learn-videos';
import './delete_trick_done';
import './delete_tricks';
import './delete_media';
import './delete_spot_edit';
import './spot_counters_after_delete';
import './profile_counters_after_delete';
import './delete_spot';
import './delete_user';

/**
 * Config
 */

chai.config.includeStack = false;
chai.use(shallowDeepEqual);

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

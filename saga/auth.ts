import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';

import { removeUser, setUser } from 'lib/auth';
import { cairote } from 'lib/cairote';
import { showMessage, userSignin, userSigninSuccess, userSignoutSuccess } from 'store/auth/actions';
import { GET_ME, SIGNIN_USER, SIGNOUT_USER } from 'store/constants';

const signinRequest = async (email: string, password: string, rememberMe: boolean) => {
    const response = await cairote.post('/login', {
        username: email,
        password,
        rememberMe,
        mobile: false,
    });

    const user = response.data.user;
    user.intercomHmac = response.data.intercomHmac;

    return user;
};

const signoutRequest = async () => {
    await cairote.post('/logout');
    return;
};

const getMeRequest = async () => {
    const response = await cairote.get('/me');

    return response.data;
};

function* signinUserWithEmailPassword(action: ActionType<typeof userSignin>) {
    const { email, password, rememberMe } = action.payload;

    try {
        const user = yield call(signinRequest, email, password, rememberMe);
        setUser(user);
        yield put(userSigninSuccess(user));
    } catch (error) {
        yield put(showMessage(error.response.data.message));
    }
}

function* signout() {
    try {
        removeUser();
        yield call(signoutRequest);
        yield put(userSignoutSuccess());
    } catch (error) {
        yield put(showMessage(error.response.data.message));
    }
}

function* getMe() {
    try {
        const user = yield call(getMeRequest);
        setUser(user);
        yield put(userSigninSuccess(user));
    } catch (error) {
        yield put(showMessage(error.response.data.message));
    }
}

export function* signinUser() {
    yield takeLatest(SIGNIN_USER, signinUserWithEmailPassword);
}

export function* signoutUser() {
    yield takeLatest(SIGNOUT_USER, signout);
}

export function* getMyself() {
    yield takeLatest(GET_ME, getMe);
}

export default function* rootSaga() {
    yield all([fork(signinUser), fork(signoutUser), fork(getMyself)]);
}

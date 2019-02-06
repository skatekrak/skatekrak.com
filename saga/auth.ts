import { all, call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';

import { removeUser, setUser } from 'lib/auth';
import { cairote } from 'lib/cairote';
import { showMessage, userSignin, userSigninSuccess, userSignoutSuccess } from 'store/auth/actions';
import { SIGNIN_USER, SIGNOUT_USER } from 'store/constants';

const signinRequest = async (email: string, password: string, rememberMe: boolean) => {
    const response = await cairote.post('/login', {
        username: email,
        password,
        rememberMe,
        mobile: false,
    });

    return response.data.user;
};

const signoutRequest = async () => {
    await cairote.post('/logout');
    return;
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
        yield call(signoutRequest);
        removeUser();
        yield put(userSignoutSuccess());
    } catch (error) {
        yield put(showMessage(error.response.data.message));
    }
}

export function* signinUser() {
    yield takeLatest(SIGNIN_USER, signinUserWithEmailPassword);
}

export function* signoutUser() {
    yield takeEvery(SIGNOUT_USER, signout);
}

export default function* rootSaga() {
    yield all([fork(signinUser), fork(signoutUser)]);
}

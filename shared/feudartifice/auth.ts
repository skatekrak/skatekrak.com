import client from './client';
import { User } from './types';

export const setToken = (token?: string) => {
    if (token == null) {
        delete client.defaults.headers.common['Authorization'];
    } else {
        client.defaults.headers.common['Authorization'] = `${token}`;
    }
};

export type AuthenticationResponse = {
    message: 'authenticated';
    token: string;
    user: User;
};

type SignupParams = {
    email: string;
    username: string;
    password: string;
    mobile: boolean;
};

export const signup = async ({ email, username, password, mobile }: SignupParams) => {
    const res = await client.post<AuthenticationResponse>('/auth/signup', {
        username,
        email,
        password,
        mobile,
    });

    setToken(res.data.token);

    return res.data;
};

type LoginParams = {
    username: string;
    password: string;
    mobile?: boolean;
    rememberMe?: boolean;
};

export const login = async ({ username, password, mobile = false, rememberMe = false }: LoginParams) => {
    const res = await client.post<AuthenticationResponse>('/auth/login', {
        username,
        password,
        mobile,
        rememberMe,
    });

    setToken(res.data.token);

    return res.data;
};

type FacebookLoginParams = {
    accessToken: string;
};

export const facebookLogin = async ({ accessToken }: FacebookLoginParams) => {
    const res = await client.post<AuthenticationResponse>('/auth/facebook/login', {
        accessToken,
        mobile: true,
    });

    setToken(res.data.token);

    return res.data;
};

type FacebookSignupParams = {
    accessToken: string;
    username: string;
};

export const facebookSignup = async ({ accessToken, username }: FacebookSignupParams) => {
    const res = await client.post<AuthenticationResponse>('/auth/facebook/signup', {
        accessToken,
        username,
        mobile: true,
    });

    setToken(res.data.token);

    return res.data;
};

export const logout = async () => {
    await client.post('/auth/logout');
    setToken(undefined);
};

export const renameUser = async (id: string, newName: string) => {
    const res = await client.post<AuthenticationResponse>(`/users/${id}/rename`, {
        username: newName,
    });

    return res.data;
};

export const forgotPassword = async (email: string) => {
    await client.post('/auth/forgot', {
        email,
    });
};

type ResetPasswordParams = {
    resetToken: string;
    password: string;
};

type ResetPasswordResponse = {
    message: string;
};
export const resetPassword = async (params: ResetPasswordParams) => {
    const res = await client.post<ResetPasswordResponse>('/auth/reset', params);
    return res.data;
};

type AppleLoginParams = {
    identifyToken: string;
};

export const appleLogin = async ({ identifyToken }: AppleLoginParams) => {
    const res = await client.post<AuthenticationResponse>('/auth/apple/login', {
        identifyToken,
    });

    setToken(res.data.token);

    return res.data;
};

type AppleSignupParams = {
    identifyToken: string;
    username: string;
};

export const appleSignup = async ({ identifyToken, username }: AppleSignupParams) => {
    const res = await client.post<AuthenticationResponse>('/auth/apple/signup', {
        identifyToken,
        username,
        mobile: true,
    });

    setToken(res.data.token);

    return res.data;
};

export type SessionResponse = {
    _id: string;
    id: string;
    role: 'user' | 'moderator' | 'admin';
};
export const getSession = async () => {
    const res = await client.get<SessionResponse>('/auth/session');
    return res.data;
};

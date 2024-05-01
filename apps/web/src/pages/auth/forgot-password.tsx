import React from 'react';
import { NextPage } from 'next';

import Layout from '@/components/Layout';

import useSession from '@/lib/hook/carrelage/use-session';
import { useRouter } from 'next/router';
import ForgotPasswordContainer from '@/components/pages/auth/ForgotPasswordContainer';

const ForgotPassword: NextPage = () => {
    const router = useRouter();
    const { isSuccess: gotSession, isLoading } = useSession();

    if (gotSession) {
        router.push('/');
    }

    if (isLoading) {
        // TODO: Display loading page
    }

    return (
        <Layout>
            <ForgotPasswordContainer />
        </Layout>
    );
};

export default ForgotPassword;

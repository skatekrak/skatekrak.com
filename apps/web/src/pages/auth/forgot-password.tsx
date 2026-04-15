import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import Layout from '@/components/Layout';
import ForgotPasswordContainer from '@/components/pages/auth/ForgotPasswordContainer';
import useSession from '@/lib/hook/carrelage/use-session';

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

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import Layout from '@/components/Layout';
import ResetPasswordContainer from '@/components/pages/auth/ResetPasswordContainer';
import useSession from '@/lib/hook/carrelage/use-session';

const ResetPassword: NextPage = () => {
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
            <ResetPasswordContainer />
        </Layout>
    );
};

export default ResetPassword;

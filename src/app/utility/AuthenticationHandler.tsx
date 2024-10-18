'use client';

import React, { useEffect } from 'react';
import { useAuthentication } from '../store/AuthStore';
import { useRouter } from 'next/navigation';

const AuthenticationHandler: React.FC = () => {
    const { isAuthenticated } = useAuthentication();
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/budgets');
        } else {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    return null;
};

export default AuthenticationHandler;

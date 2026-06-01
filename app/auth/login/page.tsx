'use client';

import dynamic from 'next/dynamic';

const LoginPage = dynamic(() => import('./login-client'), { ssr: false });

export default LoginPage;

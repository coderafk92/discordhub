'use client';

import dynamic from 'next/dynamic';

const SignupPage = dynamic(() => import('./signup-client'), { ssr: false });

export default SignupPage;

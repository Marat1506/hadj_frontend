'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';

import { getAuthToken } from '@/hooks/cookies';
import type { RootState } from '@/store';
import { initializeAuth, fetchUserProfile } from '@/store/slices/authSlice';

const AuthRedirectHandler = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const router = useRouter(); 

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      dispatch(initializeAuth({ accessToken: token }));
      dispatch(fetchUserProfile() as any);
    }
  }, [dispatch]);

  // Если нужно делать редирект, раскомментируй:
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.push('/')
  //   }
  // }, [isAuthenticated, router])

  return null;
};

export default AuthRedirectHandler;

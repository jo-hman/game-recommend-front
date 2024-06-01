'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';

import { apiBaseUrl } from '../utils/api';
import { jwtDecode } from 'jwt-decode';

type Session = {
  jwt: string;
};

const COOKIE_NAME = 'session';

const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [hasSession, setHasSession] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const sessionCookie = Cookies.get(COOKIE_NAME);

    if (sessionCookie) {
      console.log('sessionCookie:', sessionCookie);
      const parsedSession = JSON.parse(sessionCookie);
      setSession(parsedSession);
      setHasSession(true);
    } else {
      console.log('No session found');
      setHasSession(false);
      setSession(null);
    }
  }, [pathname]);

  useEffect(() => {
    console.log('Session updated:', session);
  }, [session]);

  const register = useCallback(
    async (username: string, password: string) => {
      if (!username || !password) {
        return null;
      }

      try {
        const { data } = await axios.post<Session>(`${apiBaseUrl}/accounts`, {
          username,
          password,
        });

        const decodedToken: { exp: number } = jwtDecode(data.jwt);

        Cookies.set(COOKIE_NAME, JSON.stringify(data), {
          expires: new Date(decodedToken.exp * 1000),
        });

        setSession(data); // Set session state after successful registration
        setHasSession(true);

        router.push('/panel');
      } catch (error) {
        console.error('Error during registration:', error);
        throw error;
      }
    },
    [router]
  );

  const login = useCallback(
    async (username: string, password: string) => {
      if (!username || !password) {
        return null;
      }
      try {
        const { data } = await axios.post<Session>(`${apiBaseUrl}/accounts/jwt`, {
          username,
          password,
        });

        const decodedToken: { exp: number } = jwtDecode(data.jwt);
        console.log("Login response:", data);

        Cookies.set(COOKIE_NAME, JSON.stringify(data), {
          expires: new Date(decodedToken.exp * 1000),
        });

        setSession(data); // Set session state after successful login
        setHasSession(true);

        router.push('/panel');
      } catch (error) {
        console.error('Error during login:', error);
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    Cookies.remove(COOKIE_NAME);

    setSession(null);
    setHasSession(false);

    router.push('/login');
  }, [router]);

  return {
    session,
    hasSession,
    register,
    login,
    logout,
  };
};

export { useSession, COOKIE_NAME, type Session };

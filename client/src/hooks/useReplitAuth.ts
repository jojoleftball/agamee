import { useState, useEffect, useCallback } from 'react';

interface ReplitUser {
  id: string;
  name: string;
  url?: string;
  profileImage?: string;
  roles?: string;
}

export function useReplitAuth() {
  const [user, setUser] = useState<ReplitUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/__replauthuser');
      if (response.ok) {
        const data = await response.json();
        if (data && data.id) {
          setUser(data);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log('Auth check failed:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(() => {
    const h = 500;
    const w = 350;
    const left = window.screen.width / 2 - w / 2;
    const top = window.screen.height / 2 - h / 2;

    const authWindow = window.open(
      `https://replit.com/auth_with_repl_site?domain=${location.host}`,
      '_blank',
      `modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`
    );

    const authComplete = (e: MessageEvent) => {
      if (e.data !== 'auth_complete') return;
      window.removeEventListener('message', authComplete);
      if (authWindow) authWindow.close();
      fetchUser();
    };

    window.addEventListener('message', authComplete);
  }, [fetchUser]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
}

// auth/confirm.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function EmailCallback() {
  const router = useRouter();

  useEffect(() => {
    // Refresh the session after email confirmation
    const refreshSession = async () => {
      await supabase.auth.getSession(); // ensures Supabase client syncs session state
      router.push('/'); // redirect to homepage
    };

    refreshSession();
  }, []);

  return <p>Confirming your email, please wait...</p>;
}
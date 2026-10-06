import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL;

export function useAuth() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [signInError, setSignInError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;

      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signIn(password) {
    setSignInError("");
    setSigningIn(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: OWNER_EMAIL,
      password: password,
    });

    setSigningIn(false);

    if (error) {
      setSignInError("Invalid password.");
      return false;
    }

    return true;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { session, authLoading, signIn, signInError, signingIn, signOut };
}

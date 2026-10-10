import AuthedApp from "./AuthedApp.jsx";

import LoginView from "./views/Login.jsx";

import { useAuth } from "./hooks/useAuth.js";

function App() {
  const { session, authLoading, signIn, signInError, signingIn, signOut } =
    useAuth();

  if (authLoading) {
    return <div className="tixniverse-app min-h-screen w-full" />;
  }

  if (!session) {
    return (
      <LoginView onSignIn={signIn} error={signInError} loading={signingIn} />
    );
  }

  return <AuthedApp onSignOut={signOut} />;
}

export default App;

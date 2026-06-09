import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, signInWithGoogle as firebaseGoogleSignIn } from './firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(() => localStorage.getItem('guest_mode') === 'true');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        localStorage.removeItem('guest_mode');
      }
    });
    return unsubscribe;
  }, []);

  const signUp = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
    await firebaseSignOut(auth);
  };
  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const signInWithGoogle = async () => {
    const result = await firebaseGoogleSignIn();
    const isNewUser = result?.additionalUserInfo?.isNewUser;
    if (isNewUser) {
      await firebaseSignOut(auth);
      return { registered: true };
    }
    return { registered: false };
  };

  const signOut = async () => {
    setGuest(false);
    localStorage.removeItem('guest_mode');
    await firebaseSignOut(auth);
  };

  const continueAsGuest = () => {
    setGuest(true);
    localStorage.setItem('guest_mode', 'true');
  };

  const isAuthenticated = !!(user || guest);

  return (
    <AuthContext.Provider value={{ user, guest, loading, isAuthenticated, signUp, signIn, signInWithGoogle, signOut, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

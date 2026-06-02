import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, twitterProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  role: 'user' | 'super_admin' | null;
  loading: boolean;
  signIn: (provider: 'google' | 'twitter') => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signIn: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signOutUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'user' | 'super_admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch role from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role as 'user' | 'super_admin');
        } else {
            // Default role-ing
            const defaultRole = currentUser.email === 'ottus2023@gmail.com' ? 'super_admin' : 'user';
            await setDoc(doc(db, 'users', currentUser.uid), {
                email: currentUser.email,
                role: defaultRole
            });
            setRole(defaultRole);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (provider: 'google' | 'twitter') => {
    const p = provider === 'google' ? googleProvider : twitterProvider;
    await signInWithPopup(auth, p);
  };
  
  const signInWithEmail = async (email: string, pass: string) => {
      await signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signUpWithEmail = async (email: string, pass: string) => {
      await createUserWithEmailAndPassword(auth, email, pass);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signInWithEmail, signUpWithEmail, signOutUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleSignInWithProvider = async (provider: 'google' | 'twitter') => {
    try {
      await signIn(provider);
      navigate('/');
    } catch (e: any) {
      setError(e.message);
    }
  };
  
  const handleEmailAuth = async (isSignUp: boolean) => {
    try {
        if (isSignUp) await signUpWithEmail(email, password);
        else await signInWithEmail(email, password);
        navigate('/');
    } catch (e: any) {
        setError(e.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">AKIRA</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="mb-2 p-2 border rounded text-black" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="mb-2 p-2 border rounded text-black" />
      
      <div className="flex gap-2 mb-4">
        <button onClick={() => handleEmailAuth(false)} className="bg-gray-700 text-white px-4 py-2 rounded">Sign In</button>
        <button onClick={() => handleEmailAuth(true)} className="bg-gray-600 text-white px-4 py-2 rounded">Sign Up</button>
      </div>

      <button onClick={() => handleSignInWithProvider('google')} className="bg-blue-600 text-white px-4 py-2 rounded mb-2 w-full max-w-xs">
        Sign in with Google
      </button>
      <button onClick={() => handleSignInWithProvider('twitter')} className="bg-sky-500 text-white px-4 py-2 rounded w-full max-w-xs">
        Sign in with Twitter
      </button>
    </div>
  );
}

import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { signOutUser, role, user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="p-4 flex gap-4 bg-gray-900">
        <Link to="/">Home</Link>
        <Link to="/library">Library</Link>
        <Link to="/selected">Selected</Link>
        <Link to="/profile">Profile</Link>
        {user && role === 'super_admin' && <Link to="/admin">Admin</Link>}
        {user && <button onClick={signOutUser} className="ml-auto">Sign Out</button>}
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

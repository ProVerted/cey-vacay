'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight">
            <span className="text-2xl font-bold text-blue-600">🌴 Cey-Vacay</span>
            <span className="text-xs text-gray-400 font-medium tracking-wide">Your trusted vacation consultant</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition">
            Explore
          </Link>

          {user ? (
            <>
              <Link
                href="/listings/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                + New Listing
              </Link>
              <span className="text-gray-600 text-sm">Hi, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 transition text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600 transition">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
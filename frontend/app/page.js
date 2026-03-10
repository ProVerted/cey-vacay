'use client';
import { useEffect, useState } from 'react';
import { getListings } from '../lib/api';
import ListingCard from '../components/ListingCard';

export default function FeedPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [query, setQuery]       = useState('');

  // Fetch listings whenever search query changes
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await getListings(query);
        setListings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative text-center mb-12 py-16 px-4 rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 40%, #10b981 100%)',
          boxShadow: '0 20px 60px rgba(14, 165, 233, 0.3)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-4 left-8 text-5xl opacity-20 select-none"
          style={{ animation: 'float 4s ease-in-out infinite' }}>🌴</div>
        <div className="absolute bottom-4 right-8 text-5xl opacity-20 select-none"
          style={{ animation: 'float 4s ease-in-out infinite 1s' }}>✈️</div>
        <div className="absolute top-6 right-24 text-3xl opacity-15 select-none"
          style={{ animation: 'float 5s ease-in-out infinite 0.5s' }}>🌊</div>
        <div className="absolute bottom-6 left-24 text-3xl opacity-15 select-none"
          style={{ animation: 'float 6s ease-in-out infinite 2s' }}>🐚</div>

        {/* Content */}
        <div className="relative z-10">
          <div className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-4 backdrop-blur-sm">
            🇱🇰 Sri Lanka & Beyond
          </div>
          <h1 className="text-5xl font-black text-white mb-3 drop-shadow-md">
            Discover Amazing<br />
            <span className="text-yellow-300">Cey-Vacay</span> Experiences 🌍
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Find unique travel experiences shared by locals around the world
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-10">
        <input
          type="text"
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Search
        </button>
        {query && (
          <button
            type="button"
            onClick={() => { setSearch(''); setQuery(''); }}
            className="text-gray-500 hover:text-red-500 px-3"
          >
            ✕
          </button>
        )}
      </form>

      {/* Results */}
      {loading ? (
        <div className="text-center text-gray-400 py-20 text-xl">Loading...</div>
      ) : listings.length === 0 ? (
        <div className="text-center text-gray-400 py-20 text-xl">
          No listings found 😢
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">
            {listings.length} experience{listings.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
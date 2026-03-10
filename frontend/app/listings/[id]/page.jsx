'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format } from 'timeago.js';
import { getListing, deleteListing, likeListing } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

export default function ListingDetailPage() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked]     = useState(false);
  const { user } = useAuth();
  const { id }   = useParams();
  const router   = useRouter();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getListing(id);
        setListing(res.data);
      } catch {
        toast.error('Listing not found');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteListing(id);
      toast.success('Listing deleted');
      router.push('/');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleLike = async () => {
    if (!user) return toast.error('Please login to like');
    if (liked)  return toast('Already liked!');
    try {
      const res = await likeListing(id);
      setListing({ ...listing, likes: res.data.likes });
      setLiked(true);
      toast.success('Liked! ❤️');
    } catch {
      toast.error('Failed to like');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400 text-xl">Loading...</div>;
  if (!listing) return null;

  const isCreator = user && user.id === listing.creator?._id;

  return (
    <div className="max-w-3xl mx-auto">

      {/* Back button */}
      <Link href="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        ← Back to Feed
      </Link>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Image */}
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-72 object-cover"
          onError={(e) => { e.target.src = 'https://placehold.co/800x400?text=No+Image'; }}
        />

        <div className="p-6">
          {/* Location */}
          <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
            📍 {listing.location}
          </span>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-3">
            {listing.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 flex-wrap">
            <span>By <strong>{listing.creator?.name}</strong></span>
            <span>{format(listing.createdAt)}</span>
            {listing.price && (
              <span className="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full">
                ${listing.price}
              </span>
            )}
            <span className="text-red-400">❤️ {listing.likes} likes</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            {listing.description}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleLike}
              className={`px-5 py-2 rounded-xl font-medium transition ${
                liked
                  ? 'bg-red-100 text-red-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              ❤️ {liked ? 'Liked' : 'Like'}
            </button>

            {isCreator && (
              <>
                <Link
                  href={`/listings/${id}/edit`}
                  className="bg-yellow-400 text-white px-5 py-2 rounded-xl hover:bg-yellow-500 transition font-medium"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition font-medium"
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from 'next/link';
import { format } from 'timeago.js';

export default function ListingCard({ listing }) {
  return (
    <Link href={`/listings/${listing._id}`}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer group">

        {/* Image */}
        <div className="h-48 overflow-hidden">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              e.target.src = 'https://placehold.co/600x400?text=No+Image';
            }}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Location badge */}
          <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
            📍 {listing.location}
          </span>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-800 mt-1 line-clamp-1">
            {listing.title}
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {listing.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-400">
              By <span className="font-medium text-gray-600">
                {listing.creator?.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {listing.price && (
                <span className="text-blue-600 font-bold text-sm">
                  ${listing.price}
                </span>
              )}
              <span className="text-xs text-gray-400">
                {format(listing.createdAt)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
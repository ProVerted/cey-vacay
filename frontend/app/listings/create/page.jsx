'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createListing } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

export default function CreateListingPage() {
  const [form, setForm] = useState({
    title: '', location: '', imageUrl: '', description: '', price: '',
  });
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login first');
      router.push('/login');
    }
  }, [user, authLoading]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : null,
      };
      await createListing(payload);
      toast.success('Listing created! 🎉');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'title',       label: 'Experience Title',  type: 'text',   placeholder: 'Sunset Boat Tour' },
    { name: 'location',    label: 'Location',           type: 'text',   placeholder: 'Bali, Indonesia' },
    { name: 'imageUrl',    label: 'Image URL',          type: 'url',    placeholder: 'https://...' },
    { name: 'price',       label: 'Price',   type: 'number', placeholder: '45' },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Create a New Listing</h1>
      <p className="text-gray-500 mb-6">Share your travel experience with the world</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {fields.map(({ name, label, type, placeholder }) => (
          <div key={name}>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
              name={name}
              type={type}
              placeholder={placeholder}
              value={form[name]}
              onChange={handleChange}
              required={name !== 'price'}
              className="w-full mt-1 border-2 border-gray-400 rounded-xl px-4 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
        ))}

        {/* Description (textarea) */}
        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            placeholder="Describe the experience in detail..."
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full mt-1 border-2 border-gray-400 rounded-xl px-4 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>

        {/* Image Preview */}
        {form.imageUrl && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Image Preview</p>
            <img
              src={form.imageUrl}
              alt="preview"
              className="w-full h-48 object-cover rounded-xl"
              onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Invalid+URL'; }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Listing ✈️'}
        </button>
      </form>
    </div>
  );
}
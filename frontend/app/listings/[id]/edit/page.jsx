'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getListing, updateListing } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';

export default function EditListingPage() {
  const [form, setForm] = useState({
    title: '', location: '', imageUrl: '', description: '', price: '',
  });
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { id }   = useParams();
  const router   = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading]);

  // Pre-fill form with existing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getListing(id);
        const l   = res.data;
        setForm({
          title:       l.title,
          location:    l.location,
          imageUrl:    l.imageUrl,
          description: l.description,
          price:       l.price || '',
        });
      } catch {
        toast.error('Could not load listing');
        router.push('/');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateListing(id, {
        ...form,
        price: form.price ? Number(form.price) : null,
      });
      toast.success('Listing updated! ✅');
      router.push(`/listings/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {[
          { name: 'title',    label: 'Title',           type: 'text'   },
          { name: 'location', label: 'Location',        type: 'text'   },
          { name: 'imageUrl', label: 'Image URL',       type: 'url'    },
          { name: 'price',    label: 'Price (optional)', type: 'number' },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              required={name !== 'price'}
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes ✅'}
        </button>
      </form>
    </div>
  );
}
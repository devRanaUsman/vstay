import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import * as api from '../services/api';

export default function EditHomePage() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [home, setHome] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!currentUser || currentUser.userType !== 'host') {
            navigate('/');
            return;
        }
        api.getHome(id)
            .then(res => setHome(res.data))
            .catch(() => navigate('/dashboard'))
            .finally(() => setLoading(false));
    }, [id, currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData();
        formData.append('name', form.name.value.trim());
        formData.append('location', form.location.value.trim());
        formData.append('price', form.price.value);
        formData.append('rating', form.rating.value);
        formData.append('description', form.description.value.trim());
        formData.append('photo', form.photo.value);
        if (form.image.files[0]) {
            formData.append('image', form.image.files[0]);
        }

        setSaving(true);
        try {
            await api.updateHome(id, formData);
            showToast('Property updated successfully!', 'success');
            navigate('/dashboard');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update property', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="fade-in py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-8 skeleton rounded w-1/3 mb-8"></div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 skeleton rounded"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    if (!home) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
                    <button onClick={() => navigate('/dashboard')} className="px-6 py-3 btn-primary text-white font-semibold rounded-full">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Edit Property</h1>
                    <p className="text-gray-600">Update your listing details</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Property Name</label>
                                <input type="text" id="name" name="name" required defaultValue={home.name}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all" />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input type="text" id="location" name="location" required defaultValue={home.location}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Price per Night ($)</label>
                                    <input type="number" id="price" name="price" required min="1" defaultValue={home.price}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all" />
                                </div>
                                <div>
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                    <input type="number" id="rating" name="rating" required min="1" max="5" step="0.1" defaultValue={home.rating}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea id="description" name="description" required rows="4" defaultValue={home.description}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all resize-none"></textarea>
                            </div>
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Replace Photo</label>
                                <input type="file" id="image" name="image" accept="image/*"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                                <p className="text-xs text-gray-500 mt-1">Upload a new image to replace the current one</p>
                            </div>
                            <div>
                                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">Property Style</label>
                                <select id="photo" name="photo" required defaultValue={home.photo}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all bg-white">
                                    <option value="ocean">🌊 Oceanfront / Beach</option>
                                    <option value="mountain">🏔️ Mountain / Alpine</option>
                                    <option value="city">🏙️ Urban / City</option>
                                    <option value="tropical">🌴 Tropical / Island</option>
                                    <option value="desert">🏜️ Desert / Southwest</option>
                                    <option value="lake">🏞️ Lakefront / Waterfront</option>
                                    <option value="default">✨ Modern / Contemporary</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" disabled={saving} className="w-full mt-8 py-4 btn-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all text-lg">
                            {saving ? '⟳ Saving changes...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

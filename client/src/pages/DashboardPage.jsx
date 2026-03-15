import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getPhotoGradient } from '../utils/helpers';
import DeleteModal from '../components/DeleteModal';
import * as api from '../services/api';

export default function DashboardPage() {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [homes, setHomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        if (!currentUser || currentUser.userType !== 'host') {
            navigate('/');
            return;
        }
        fetchHomes();
    }, [currentUser]);

    const fetchHomes = async () => {
        try {
            const res = await api.getMyHomes();
            setHomes(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.deleteHome(deleteId);
            showToast('Property deleted successfully', 'success');
            setDeleteId(null);
            fetchHomes();
        } catch (err) {
            showToast('Failed to delete property', 'error');
        }
    };

    if (loading) {
        return (
            <div className="fade-in py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-10 skeleton rounded w-1/3 mb-10"></div>
                    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-16 skeleton rounded"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Host Dashboard</h1>
                        <p className="text-gray-600">Manage your property listings</p>
                    </div>
                    <button onClick={() => navigate('/add-home')} className="px-6 py-3 btn-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 self-start">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Property
                    </button>
                </div>

                {homes.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
                        <p className="text-gray-500 mb-6">Start earning by listing your first property!</p>
                        <button onClick={() => navigate('/add-home')} className="px-6 py-3 btn-primary text-white font-semibold rounded-full">
                            Add Your First Property
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Property</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">Location</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Price</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">Rating</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {homes.map(home => (
                                        <tr key={home._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl flex-shrink-0" style={
                                                        home.imageUrl
                                                            ? { backgroundImage: `url(${home.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                                            : { background: getPhotoGradient(home.photo) }
                                                    }></div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{home.name}</p>
                                                        <p className="text-sm text-gray-500 sm:hidden">{home.location}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 hidden sm:table-cell">{home.location}</td>
                                            <td className="px-6 py-4 text-gray-900 font-medium hidden md:table-cell">${home.price}/night</td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                    {home.rating}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => navigate(`/edit-home/${home._id}`)} className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Edit">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => setDeleteId(home._id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {deleteId && (
                <DeleteModal
                    onClose={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}

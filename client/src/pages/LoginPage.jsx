import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function LoginPage() {
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value.trim().toLowerCase();
        const password = e.target.password.value;

        setLoading(true);
        try {
            const user = await login(email, password);
            showToast(`Welcome back, ${user.firstName}!`, 'success');
            navigate('/');
        } catch (err) {
            showToast(err.response?.data?.message || 'Invalid email or password', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100%-4rem)] flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full fade-in">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl hero-gradient flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                                <input type="email" id="email" name="email" required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder="you@example.com" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input type="password" id="password" name="password" required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder="••••••••" />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full mt-6 py-3.5 btn-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                            {loading ? '⟳ Logging in...' : 'Log In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-purple-600 font-semibold hover:text-purple-700">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

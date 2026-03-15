import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function SignupPage() {
    const { signup } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const firstName = form.firstName.value.trim();
        const lastName = form.lastName.value.trim();
        const email = form.email.value.trim().toLowerCase();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const userType = form.userType.value;

        if (!email.includes('@') || !email.includes('.')) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        setLoading(true);
        try {
            await signup({ firstName, lastName, email, password, userType });
            showToast('Account created successfully!', 'success');
            navigate('/');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to create account', 'error');
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Create account</h1>
                    <p className="text-gray-600">Join V-Stay today</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                                    <input type="text" id="firstName" name="firstName" required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all"
                                        placeholder="John" />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                                    <input type="text" id="lastName" name="lastName" required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all"
                                        placeholder="Doe" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                                <input type="email" id="email" name="email" required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder="you@example.com" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input type="password" id="password" name="password" required minLength="8"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder="••••••••" />
                                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" required minLength="8"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder="••••••••" />
                            </div>
                            <div>
                                <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
                                <select id="userType" name="userType" required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none transition-all bg-white">
                                    <option value="guest">Book stays (Guest)</option>
                                    <option value="host">List properties (Host)</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full mt-6 py-3.5 btn-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                            {loading ? '⟳ Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-700">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

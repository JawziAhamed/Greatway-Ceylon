import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Loader2 } from 'lucide-react';
import { adminLogin } from '../utils/api';
import logo from '../assets/logo.png';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await adminLogin(username, password);
            localStorage.setItem('adminToken', data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-earth-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-gold-500 rounded-full opacity-10 blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-primary-400 rounded-full opacity-10 blur-[100px]"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center">
                    <img src={logo} alt="Logo" className="w-16 h-16 object-contain rounded-full bg-white p-1" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white font-heading">
                    Admin Portal
                </h2>
                <p className="mt-2 text-center text-sm text-primary-200">
                    Greatway Import and Exports — Management
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="glass-effect py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm text-center">
                                ⚠️ {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none transition-all"
                                    placeholder="admin"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary-700 hover:bg-primary-800 disabled:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all hover:-translate-y-0.5 disabled:transform-none"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
                            ) : 'Sign in'}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4">
                            Default credentials: <code className="bg-gray-100 px-1 rounded">admin / admin123</code>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, MessageSquare, LogOut, Trash2, Plus, Edit,
    CheckCircle, Clock, Loader2, X, Save, AlertTriangle
} from 'lucide-react';
import logo from '../assets/logo.png';
import {
    getProducts, createProduct, updateProduct, deleteProduct,
    getInquiries, updateInquiryStatus, deleteInquiry
} from '../utils/api';

const CATEGORIES = ['Fresh Fruits', 'Fresh Vegetables', 'Spices', 'Nuts', 'Tea'];

const statusColors = {
    new: 'bg-yellow-100 text-yellow-800',
    read: 'bg-blue-100 text-blue-800',
    replied: 'bg-green-100 text-green-800',
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('inquiries');
    const navigate = useNavigate();

    // Products state
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({ name: '', category: 'Fresh Fruits', description: '', imageUrl: '' });

    // Inquiries state
    const [inquiries, setInquiries] = useState([]);
    const [inquiriesLoading, setInquiriesLoading] = useState(false);

    // General state
    const [actionLoading, setActionLoading] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) navigate('/admin/login');
    }, [navigate]);

    const loadProducts = useCallback(async () => {
        setProductsLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch { setError('Failed to load products.'); }
        finally { setProductsLoading(false); }
    }, []);

    const loadInquiries = useCallback(async () => {
        setInquiriesLoading(true);
        try {
            const data = await getInquiries();
            setInquiries(data);
        } catch { setError('Failed to load inquiries.'); }
        finally { setInquiriesLoading(false); }
    }, []);

    useEffect(() => {
        if (activeTab === 'products') loadProducts();
        if (activeTab === 'inquiries') loadInquiries();
    }, [activeTab, loadProducts, loadInquiries]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const handleProductSave = async (e) => {
        e.preventDefault();
        setActionLoading(p => ({ ...p, productSave: true }));
        try {
            if (editingProduct) {
                const updated = await updateProduct(editingProduct._id, productForm);
                setProducts(p => p.map(x => x._id === editingProduct._id ? updated : x));
            } else {
                const created = await createProduct(productForm);
                setProducts(p => [created, ...p]);
            }
            setShowProductForm(false);
            setEditingProduct(null);
            setProductForm({ name: '', category: 'Fresh Fruits', description: '', imageUrl: '' });
        } catch (err) { setError(err.message); }
        finally { setActionLoading(p => ({ ...p, productSave: false })); }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        setActionLoading(p => ({ ...p, [id]: true }));
        try {
            await deleteProduct(id);
            setProducts(p => p.filter(x => x._id !== id));
        } catch (err) { setError(err.message); }
        finally { setActionLoading(p => ({ ...p, [id]: false })); }
    };

    const openEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name, category: product.category,
            description: product.description, imageUrl: product.imageUrl
        });
        setShowProductForm(true);
    };

    const handleUpdateInquiry = async (id, status) => {
        setActionLoading(p => ({ ...p, [id]: true }));
        try {
            const updated = await updateInquiryStatus(id, status);
            setInquiries(p => p.map(x => x._id === id ? updated : x));
        } catch (err) { setError(err.message); }
        finally { setActionLoading(p => ({ ...p, [id]: false })); }
    };

    const handleDeleteInquiry = async (id) => {
        if (!confirm('Delete this inquiry permanently?')) return;
        setActionLoading(p => ({ ...p, [`del_${id}`]: true }));
        try {
            await deleteInquiry(id);
            setInquiries(p => p.filter(x => x._id !== id));
        } catch (err) { setError(err.message); }
        finally { setActionLoading(p => ({ ...p, [`del_${id}`]: false })); }
    };

    const navItems = [
        { id: 'inquiries', icon: MessageSquare, label: 'View Inquiries' },
        { id: 'products', icon: Package, label: 'Manage Products' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">

            {/* Sidebar */}
            <div className="w-full md:w-64 bg-primary-900 text-white flex flex-col shrink-0">
                <div className="p-6 border-b border-primary-800 flex items-center gap-3">
                    <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded-full bg-white p-0.5" />
                    <div>
                        <h2 className="text-lg font-bold font-heading leading-tight">Admin Panel</h2>
                        <p className="text-primary-300 text-xs">Greatway Exports</p>
                    </div>
                </div>
                <div className="flex-1 py-4">
                    <nav className="space-y-1 px-3">
                        {navItems.map(({ id, icon: Icon, label }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === id
                                    ? 'bg-primary-700 text-white shadow-md'
                                    : 'text-primary-100 hover:bg-primary-800'
                                    }`}
                            >
                                <Icon className="mr-3 h-5 w-5" /> {label}
                                {id === 'inquiries' && inquiries.filter(i => i.status === 'new').length > 0 && (
                                    <span className="ml-auto bg-gold-500 text-primary-900 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {inquiries.filter(i => i.status === 'new').length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-4 border-t border-primary-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-300 hover:bg-primary-800 hover:text-red-200 rounded-xl transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{error}</div>
                        <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
                    </div>
                )}

                {/* ===== INQUIRIES TAB ===== */}
                {activeTab === 'inquiries' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 font-heading">Customer Inquiries</h1>
                                <p className="text-gray-500 text-sm">{inquiries.length} total, {inquiries.filter(i => i.status === 'new').length} new</p>
                            </div>
                            <button onClick={loadInquiries} className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                                ↻ Refresh
                            </button>
                        </div>

                        {inquiriesLoading ? (
                            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
                        ) : inquiries.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                                <MessageSquare className="mx-auto w-12 h-12 text-gray-300 mb-3" />
                                <p className="text-gray-500">No inquiries yet. They'll appear here when customers submit the contact form.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {inquiries.map(inq => (
                                    <div key={inq._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-bold text-gray-900">{inq.name}</h3>
                                                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${statusColors[inq.status] || 'bg-gray-100 text-gray-600'}`}>
                                                        {inq.status?.charAt(0).toUpperCase() + inq.status?.slice(1)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500">{inq.email} · {inq.phone}</p>
                                                {inq.productOfInterest && (
                                                    <p className="text-sm text-primary-600 font-medium mt-1">Product: {inq.productOfInterest}</p>
                                                )}
                                                <p className="text-gray-700 text-sm mt-3 leading-relaxed">{inq.message}</p>
                                                <p className="text-xs text-gray-400 mt-3">{new Date(inq.createdAt).toLocaleString()}</p>
                                            </div>
                                            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                                                {inq.status === 'new' && (
                                                    <button
                                                        onClick={() => handleUpdateInquiry(inq._id, 'read')}
                                                        disabled={actionLoading[inq._id]}
                                                        className="flex items-center text-xs bg-blue-100 text-blue-700 font-medium px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading[inq._id] ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                                                        Mark Read
                                                    </button>
                                                )}
                                                {inq.status === 'read' && (
                                                    <button
                                                        onClick={() => handleUpdateInquiry(inq._id, 'replied')}
                                                        disabled={actionLoading[inq._id]}
                                                        className="flex items-center text-xs bg-green-100 text-green-700 font-medium px-3 py-2 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Mark Replied
                                                    </button>
                                                )}
                                                <a
                                                    href={`mailto:${inq.email}?subject=Re: Greatway Exports Inquiry&body=Dear ${inq.name},%0A%0AThank you for your inquiry...`}
                                                    className="flex items-center text-xs bg-primary-100 text-primary-700 font-medium px-3 py-2 rounded-lg hover:bg-primary-200 transition-colors"
                                                >
                                                    Reply via Email
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteInquiry(inq._id)}
                                                    disabled={actionLoading[`del_${inq._id}`]}
                                                    className="flex items-center text-xs bg-red-50 text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                                >
                                                    {actionLoading[`del_${inq._id}`] ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Trash2 className="w-3 h-3 mr-1" />}
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ===== PRODUCTS TAB ===== */}
                {activeTab === 'products' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 font-heading">Products Management</h1>
                                <p className="text-gray-500 text-sm">{products.length} products in database</p>
                            </div>
                            <button
                                onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm({ name: '', category: 'Fresh Fruits', description: '', imageUrl: '' }); }}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl flex items-center text-sm font-medium shadow-sm transition-colors"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Product
                            </button>
                        </div>

                        {/* Product Form Modal */}
                        {showProductForm && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-900 font-heading">
                                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                                        </h3>
                                        <button onClick={() => { setShowProductForm(false); setEditingProduct(null); }}>
                                            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                        </button>
                                    </div>
                                    <form onSubmit={handleProductSave} className="p-6 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                            <input type="text" required value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. King Coconut" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                            <select value={productForm.category} onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                            <textarea required rows={3} value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Short product description..." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                                            <input type="url" required value={productForm.imageUrl} onChange={e => setProductForm(p => ({ ...p, imageUrl: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="https://..." />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button type="submit" disabled={actionLoading.productSave}
                                                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                                {actionLoading.productSave ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                {editingProduct ? 'Update' : 'Save Product'}
                                            </button>
                                            <button type="button" onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                                                className="px-6 border border-gray-300 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {productsLoading ? (
                            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                                <Package className="mx-auto w-12 h-12 text-gray-300 mb-3" />
                                <p className="text-gray-500">No products in database yet. Add your first product to get started.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {products.map(product => (
                                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                                        <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 inline-flex text-xs leading-5 font-semibold rounded-full ${product.exportAvailability ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                        {product.exportAvailability ? 'Available' : 'Unavailable'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    <button onClick={() => openEditProduct(product)} className="text-primary-600 hover:text-primary-900 mr-4 p-1.5 hover:bg-primary-50 rounded-lg transition-colors">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteProduct(product._id)} disabled={actionLoading[product._id]}
                                                        className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                                                        {actionLoading[product._id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

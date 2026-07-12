import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Package, MessageSquare, LogOut, Trash2, Plus, Edit,
    CheckCircle, Loader2, X, Save, AlertTriangle
} from 'lucide-react';
import logo from '../assets/logo.png';
import {
    getProducts, createProduct, updateProduct, deleteProduct,
    getInquiries, updateInquiryStatus, deleteInquiry
} from '../utils/api';
import { allProducts as catalogProducts } from '../data/products';

const CATEGORIES = ['Fresh Fruits', 'Fresh Vegetables', 'Spices', 'Nuts', 'Tea'];

const getProductKey = (product) => product.slug || product._id || product.id || product.name;

const toAdminProduct = (product) => ({
    ...product,
    _catalogOnly: true,
    imageUrl: product.imageUrl || product.image,
    shortDescription: product.shortDescription || product.desc,
    exportAvailability: product.exportAvailability !== false,
});

const mergeManagedAndCatalogProducts = (managedProducts = []) => {
    const managedKeys = new Set(managedProducts.map(getProductKey).filter(Boolean));
    const catalogOnlyProducts = catalogProducts
        .map(toAdminProduct)
        .filter(product => !managedKeys.has(getProductKey(product)));

    return [...managedProducts, ...catalogOnlyProducts];
};

const getEmptyProductForm = () => ({
    name: '',
    slug: '',
    category: 'Fresh Fruits',
    shortDescription: '',
    description: '',
    imageUrl: '',
    exportAvailability: true,
    scientificName: '',
    origin: 'Sri Lanka',
    hsCode: '',
    availability: '',
    packaging: '',
    shelfLife: '',
    storage: '',
    supplyCapacity: '',
    price: '',
    exportInfo: '',
    benefits: '',
    certifications: '',
});

const toMultiline = (value) => Array.isArray(value) ? value.join('\n') : '';

const toList = (value) =>
    value
        .split(/\r?\n|,/)
        .map(item => item.trim())
        .filter(Boolean);

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
    const [productForm, setProductForm] = useState(getEmptyProductForm);

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
            const data = await getProducts({ includeUnavailable: true });
            setProducts(mergeManagedAndCatalogProducts(data || []));
        } catch {
            setProducts(catalogProducts.map(toAdminProduct));
            setError('Failed to load managed products. Showing built-in catalog products only.');
        }
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
        setError('');

        const payload = {
            ...productForm,
            benefits: toList(productForm.benefits),
            certifications: toList(productForm.certifications),
            images: productForm.imageUrl ? [productForm.imageUrl] : [],
        };

        try {
            if (editingProduct) {
                const updated = await updateProduct(editingProduct._id, payload);
                setProducts(p => p.map(x => x._id === editingProduct._id ? updated : x));
            } else {
                await createProduct(payload);
                await loadProducts();
            }
            setShowProductForm(false);
            setEditingProduct(null);
            setProductForm(getEmptyProductForm());
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
        setEditingProduct(product._id ? product : null);
        setProductForm({
            name: product.name || '',
            slug: product.slug || '',
            category: product.category || 'Fresh Fruits',
            shortDescription: product.shortDescription || '',
            description: product.description || '',
            imageUrl: product.imageUrl || '',
            exportAvailability: product.exportAvailability !== false,
            scientificName: product.scientificName || '',
            origin: product.origin || 'Sri Lanka',
            hsCode: product.hsCode || '',
            availability: product.availability || '',
            packaging: product.packaging || '',
            shelfLife: product.shelfLife || '',
            storage: product.storage || '',
            supplyCapacity: product.supplyCapacity || '',
            price: product.price || '',
            exportInfo: product.exportInfo || '',
            benefits: toMultiline(product.benefits),
            certifications: toMultiline(product.certifications),
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
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === item.id
                                    ? 'bg-primary-700 text-white shadow-md'
                                    : 'text-primary-100 hover:bg-primary-800'
                                    }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" /> {item.label}
                                {item.id === 'inquiries' && inquiries.filter(i => i.status === 'new').length > 0 && (
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
                                <p className="text-gray-500 text-sm">{products.length} products in catalog and database</p>
                            </div>
                            <button
                                onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm(getEmptyProductForm()); }}
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
                                    <form onSubmit={handleProductSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                                <input type="text" required value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. King Coconut" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                                <input type="text" value={productForm.slug} onChange={e => setProductForm(p => ({ ...p, slug: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Auto-generated from name" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                                <select value={productForm.category} onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <label className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700">
                                                <input
                                                    type="checkbox"
                                                    checked={productForm.exportAvailability}
                                                    onChange={e => setProductForm(p => ({ ...p, exportAvailability: e.target.checked }))}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                Available for public catalog
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                                            <input type="url" required value={productForm.imageUrl} onChange={e => setProductForm(p => ({ ...p, imageUrl: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="https://..." />
                                            {productForm.imageUrl && (
                                                <img src={productForm.imageUrl} alt="" className="mt-3 h-28 w-full object-cover rounded-xl border border-gray-100" />
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                            <textarea rows={2} value={productForm.shortDescription} onChange={e => setProductForm(p => ({ ...p, shortDescription: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="One or two lines for product cards..." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                                            <textarea required rows={4} value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Detailed product description..." />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Scientific Name</label>
                                                <input value={productForm.scientificName} onChange={e => setProductForm(p => ({ ...p, scientificName: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">HS Code</label>
                                                <input value={productForm.hsCode} onChange={e => setProductForm(p => ({ ...p, hsCode: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                                                <input value={productForm.origin} onChange={e => setProductForm(p => ({ ...p, origin: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                                                <input value={productForm.availability} onChange={e => setProductForm(p => ({ ...p, availability: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Year-round availability" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Packaging</label>
                                                <input value={productForm.packaging} onChange={e => setProductForm(p => ({ ...p, packaging: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Life</label>
                                                <input value={productForm.shelfLife} onChange={e => setProductForm(p => ({ ...p, shelfLife: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Storage</label>
                                                <input value={productForm.storage} onChange={e => setProductForm(p => ({ ...p, storage: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Supply Capacity</label>
                                                <input value={productForm.supplyCapacity} onChange={e => setProductForm(p => ({ ...p, supplyCapacity: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Note</label>
                                            <input value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="For pricing details, please contact us." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Export Information</label>
                                            <textarea rows={2} value={productForm.exportInfo} onChange={e => setProductForm(p => ({ ...p, exportInfo: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                                                <textarea rows={4} value={productForm.benefits} onChange={e => setProductForm(p => ({ ...p, benefits: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="One per line" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                                                <textarea rows={4} value={productForm.certifications} onChange={e => setProductForm(p => ({ ...p, certifications: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="One per line" />
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2 sticky bottom-0 bg-white border-t border-gray-100 py-4">
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
                                            <tr key={product._id || `catalog-${product.slug || product.id}`} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                                            {product._catalogOnly && (
                                                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gold-100 text-gold-700">
                                                                    Catalog
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.shortDescription || product.description}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 inline-flex text-xs leading-5 font-semibold rounded-full ${product.exportAvailability ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                        {product.exportAvailability ? 'Available' : 'Unavailable'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    <button
                                                        onClick={() => openEditProduct(product)}
                                                        className="text-primary-600 hover:text-primary-900 mr-4 p-1.5 hover:bg-primary-50 rounded-lg transition-colors"
                                                        title={product._catalogOnly ? 'Create a managed database version from this catalog product' : 'Edit product'}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    {!product._catalogOnly && (
                                                        <button onClick={() => handleDeleteProduct(product._id)} disabled={actionLoading[product._id]}
                                                            className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                                                            {actionLoading[product._id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                        </button>
                                                    )}
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

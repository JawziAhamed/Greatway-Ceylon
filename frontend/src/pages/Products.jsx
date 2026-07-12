import { useState, useEffect } from 'react';
import { Leaf, Search, ArrowRight, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProducts } from '../utils/api';

const categories = ["All", "Fresh Fruits", "Fresh Vegetables", "Spices", "Nuts", "Tea"];

const slugify = (value = '') =>
    value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const allProducts = [
    // Fresh Fruits
    { id: 1, name: 'King Coconut', category: 'Fresh Fruits', image: 'https://i.pinimg.com/1200x/17/9e/c8/179ec8f821aef2b1b65ddb7196aa3eaf.jpg', desc: 'Premium sweet water coconuts, harvested fresh from the palm.' },
    { id: 2, name: 'Red Lady Papaya', category: 'Fresh Fruits', image: 'https://i.pinimg.com/1200x/84/63/55/846355a7688e86f0fd451623415a9e15.jpg', desc: 'Sweet, red-fleshed tropical papaya.' },
    { id: 3, name: 'Green Papaya', category: 'Fresh Fruits', image: 'https://www.diet-health.info/images/recipes/main_view/papaya-unreif-pawpaw-green-by-kateryna-fotolia-186049740.jpg', desc: 'Firm, unripe papaya ideal for salads and cooking.' },
    { id: 4, name: 'Avocado', category: 'Fresh Fruits', image: 'https://i.pinimg.com/736x/e4/5d/2e/e45d2e41c17cbe4d1ab93f595fcec3be.jpg', desc: 'Creamy, rich Hass and local avocado varieties.' },
    { id: 5, name: 'Rambutan', category: 'Fresh Fruits', image: 'https://i.pinimg.com/736x/4f/0b/4d/4f0b4daa7904fa976bafa3383869b94d.jpg', desc: 'Sweet, juicy tropical fruit with a hairy exterior.' },
    { id: 6, name: 'Pineapple', category: 'Fresh Fruits', image: 'https://i.pinimg.com/736x/59/26/f8/5926f8f56b1fb439e25de2fa4ffb02eb.jpg', desc: 'Golden, sweet and tangy tropical pineapples.' },
    { id: 7, name: 'Bell Pepper', category: 'Fresh Fruits', image: 'https://i.pinimg.com/736x/f2/b7/be/f2b7be150b209f188e62f166fdacda7e.jpg', desc: 'Fresh, crisp and vibrant bell peppers bursting with natural flavor.' },
    { id: 8, name: 'Mangosteen', category: 'Fresh Fruits', image: 'https://i.pinimg.com/736x/7a/84/84/7a848428f61d5969723221d47374b89b.jpg', desc: 'Royal, sweet and delicately tangy mangosteens with a rich tropical flavor.' },

    // Fresh Vegetables
    { id: 9, name: 'Cassava', category: 'Fresh Vegetables', image: 'https://i.pinimg.com/736x/25/c2/9a/25c29a51abb4f01d4a30738cdc28804e.jpg', desc: 'Premium grade starchy root vegetable.' },
    { id: 10, name: 'Cucumber', category: 'Fresh Vegetables', image: 'https://i.pinimg.com/736x/e1/00/5d/e1005d2c5dceaa88104eee885b12397a.jpg', desc: 'Cool, crunchy cucumbers packed with refreshing goodness.' },
    { id: 11, name: 'Capsicum', category: 'Fresh Vegetables', image: 'https://i.pinimg.com/736x/ce/14/97/ce1497c448466c0713a4ccb161a83e5d.jpg', desc: 'Premium quality capsicums carefully harvested for maximum freshness.' },

    // Tea
    { id: 12, name: 'Ceylon Tea Powder', category: 'Tea', image: 'https://i.pinimg.com/1200x/7e/15/de/7e15ded036668598363c3a2cc8d8785e.jpg', desc: 'Rich, full-bodied premium black tea.' },

    // Spices
    { id: 13, name: 'Ceylon Cinnamon', category: 'Spices', image: 'https://i.pinimg.com/1200x/f7/3f/3a/f73f3aec3098431ffa4da61675ee455e.jpg', desc: 'True Ceylon cinnamon quills, highly aromatic.' },
    { id: 14, name: 'Cardamom', category: 'Spices', image: 'https://i.pinimg.com/736x/cb/46/6c/cb466cc18ceee416ccc5647ead03a1db.jpg', desc: 'Intensely fragrant green cardamom pods.' },
    { id: 15, name: 'Clove', category: 'Spices', image: 'https://i.pinimg.com/736x/23/d9/1b/23d91baaa727babd4d5102cf1f2c5a01.jpg', desc: 'Rich, warm, and highly aromatic whole cloves.' },
    { id: 16, name: 'Black Pepper', category: 'Spices', image: 'https://i.pinimg.com/736x/1f/af/5f/1faf5fc9e9b479020ba0e0125f19770e.jpg', desc: 'Bold, pungent whole black peppercorns.' },

    // Nuts
    { id: 17, name: 'Cashew Nuts', category: 'Nuts', image: 'https://i.pinimg.com/736x/1d/30/13/1d301369ba5c2d2b4769735fe5498aa6.jpg', desc: 'Premium grade, creamy whole cashew nuts.' },
];

export default function Products() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data || []);
            } catch (err) {
                console.error("Failed to fetch products from backend, falling back to static list", err);
                setProducts(allProducts);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="animate-fade-in-up bg-gray-50 min-h-screen">

            {/* Page Header */}
            <div className="bg-primary-900 py-16 text-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                    <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1920&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-heading">Our Product Catalog</h1>
                    <p className="text-primary-100 max-w-2xl mx-auto text-lg">Browse our premium selection of export-quality produce native to Sri Lanka.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Filtering & Search Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${activeCategory === category
                                    ? 'bg-primary-700 text-white shadow-md transform -translate-y-0.5'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gold-100 hover:text-gold-700'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 pl-10 pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <Loader2 className="mx-auto h-16 w-16 text-primary-600 animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Loading products</h3>
                        <p className="text-gray-500">Please wait while we load our premium catalog.</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => {
                            const productId = product._id || product.id;
                            const productSlug = product.slug || slugify(product.name) || productId;
                            const productImage = product.imageUrl || product.image;
                            const productDesc = product.shortDescription || product.desc || product.description;
                            return (
                                <Link
                                    key={productId}
                                    to={`/products/${productSlug}`}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-200"
                                    aria-label={`View details for ${product.name}`}
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={productImage}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-xs font-bold text-primary-700">
                                            {product.category}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">{product.name}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">{productDesc}</p>
                                        <span className="w-full bg-primary-50 group-hover:bg-primary-700 text-primary-700 group-hover:text-white border border-primary-200 group-hover:border-transparent font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center">
                                            View Details <ArrowRight size={18} className="ml-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <Leaf className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">No products found</h3>
                        <p className="text-gray-500">We couldn't find any products matching your search criteria.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                            className="mt-6 text-primary-600 font-semibold hover:text-primary-800 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

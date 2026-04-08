import { ArrowRight, CheckCircle, ShieldCheck, Ship, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    const featuredProducts = [
        {
            name: 'King Coconut',
            category: 'Fresh Fruits',
            image: 'https://i.pinimg.com/1200x/17/9e/c8/179ec8f821aef2b1b65ddb7196aa3eaf.jpg',
        },
        {
            name: 'Ceylon Cinnamon',
            category: 'Spices',
            image: 'https://i.pinimg.com/1200x/f7/3f/3a/f73f3aec3098431ffa4da61675ee455e.jpg',
        },
        {
            name: 'Fresh Papaya',
            category: 'Fresh Fruits',
            image: 'https://i.pinimg.com/1200x/84/63/55/846355a7688e86f0fd451623415a9e15.jpg',
        },
        {
            name: 'Cardamom',
            category: 'Spices',
            image: 'https://i.pinimg.com/736x/cb/46/6c/cb466cc18ceee416ccc5647ead03a1db.jpg',
        },
    ];

    return (
        <div className="animate-fade-in-up">
            {/* Hero Section */}
            <section className="relative h-[90vh] bg-primary-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop"
                        alt="Fresh produce background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/60 to-transparent"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/50 text-sm font-semibold mb-6 animate-pulse">
                        Premium Sri Lankan Exports
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading leading-tight text-balance">
                        Nature's Finest, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Delivered Globally</span>
                    </h1>
                    <p className="text-lg md:text-xl text-primary-100 mb-10 text-balance max-w-2xl mx-auto">
                        Greatway Import and Exports is your premium partner for sourcing the highest quality fresh fruits, vegetables, and aromatic spices directly from Sri Lanka to the UAE.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/products"
                            className="bg-gold-500 text-primary-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gold-400 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            Explore Products
                        </Link>
                        <Link
                            to="/contact"
                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            Get a Quote
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-gold-600 font-semibold tracking-wide uppercase">Our Assortment</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-primary-900 sm:text-4xl font-heading">
                            Premium Export Products
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                            Sourced directly from local farmers in Sri Lanka, guaranteeing freshness and uncompromised quality.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product, index) => (
                            <div key={index} className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-gray-100">
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="bg-white/90 backdrop-blur-sm text-primary-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading group-hover:text-primary-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <ShieldCheck size={16} className="text-gold-500 mr-1" /> Premium Grade
                                        </span>
                                        <Link to="/products" className="text-primary-600 hover:text-primary-800 flex items-center text-sm font-semibold transition-colors">
                                            View Details <ArrowRight size={16} className="ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary-600 text-base font-medium rounded-full text-primary-700 bg-transparent hover:bg-primary-50 transition-colors"
                        >
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-primary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-base text-gold-600 font-semibold tracking-wide uppercase">Why Gateway</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-primary-900 sm:text-4xl font-heading mb-6">
                                Your Trusted Export Partner to the UAE
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                With deep-rooted connections in Sri Lanka and a strong logistical network into the United Arab Emirates, we ensure that the journey from farm to market is seamless, preserving the nutritional value and distinct flavors of every product.
                            </p>

                            <div className="space-y-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary-100 text-primary-600">
                                            <Leaf size={24} />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl leading-6 font-bold text-gray-900">100% Organic & Fresh</h3>
                                        <p className="mt-2 text-base text-gray-500">We source directly from certified farms, ensuring chemical-free, nutrient-rich produce.</p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gold-100 text-gold-600">
                                            <ShieldCheck size={24} />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl leading-6 font-bold text-gray-900">Quality Assured</h3>
                                        <p className="mt-2 text-base text-gray-500">Rigorous quality control processes and hygienic packaging standards applied to every shipment.</p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 text-blue-600">
                                            <Ship size={24} />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl leading-6 font-bold text-gray-900">Timely Delivery to UAE</h3>
                                        <p className="mt-2 text-base text-gray-500">Optimized air and sea freight logistics ensuring on-time delivery to markets in Dubai and across the Emirates.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-200 to-gold-200 rounded-3xl transform rotate-3 scale-105"></div>
                            <img
                                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
                                alt="Fresh produces export"
                                className="relative rounded-3xl shadow-2xl object-cover h-[600px] w-full"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center space-x-4 border border-gray-100">
                                <div className="bg-green-100 p-3 rounded-full text-green-600">
                                    <CheckCircle size={32} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Export Success Rate</p>
                                    <p className="text-2xl font-bold text-gray-900">99.9%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 bg-primary-900 overflow-hidden">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gold-500 rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-primary-500 rounded-full opacity-10 blur-3xl"></div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl font-heading text-balance">
                        Ready to import the finest Sri Lankan produce?
                    </h2>
                    <p className="mt-4 text-xl leading-6 text-primary-200 text-balance mb-8">
                        Contact us today for a customized quote tailored to your business needs in the UAE.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-primary-900 bg-gold-500 hover:bg-gold-400 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        Get in Touch <ArrowRight size={20} className="ml-2" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

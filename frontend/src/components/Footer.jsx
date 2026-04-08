import { Leaf, Phone, MapPin, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-primary-900 text-primary-50 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-white p-2 rounded-full text-primary-900">
                                <Leaf size={24} />
                            </div>
                            <span className="font-heading font-bold text-2xl text-white">
                                Greatway <span className="text-gold-500">Export</span>
                            </span>
                        </Link>
                        <p className="text-primary-200 text-sm leading-relaxed">
                            Premium exporter of fresh fruits, vegetables, and aromatic spices from Sri Lanka to the United Arab Emirates and beyond.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-primary-200 hover:text-white transition-colors bg-primary-800 p-2 rounded-full hover:bg-gold-500">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="text-primary-200 hover:text-white transition-colors bg-primary-800 p-2 rounded-full hover:bg-gold-500">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="text-primary-200 hover:text-white transition-colors bg-primary-800 p-2 rounded-full hover:bg-gold-500">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 font-heading">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Home', 'About Us', 'Products', 'Quality Standards', 'Contact Us'].map((link) => (
                                <li key={link}>
                                    <Link to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`} className="text-primary-200 hover:text-gold-400 transition-colors flex items-center">
                                        <span className="mr-2 text-gold-500">•</span> {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 font-heading">Our Expertise</h3>
                        <ul className="space-y-3">
                            <li><Link to="/products" className="text-primary-200 hover:text-gold-400 transition-colors flex items-center"><span className="mr-2 text-gold-500">•</span> Fresh Fruits</Link></li>
                            <li><Link to="/products" className="text-primary-200 hover:text-gold-400 transition-colors flex items-center"><span className="mr-2 text-gold-500">•</span> Organic Spices</Link></li>
                            <li><Link to="/products" className="text-primary-200 hover:text-gold-400 transition-colors flex items-center"><span className="mr-2 text-gold-500">•</span> Premium Nuts</Link></li>
                            <li><Link to="/products" className="text-primary-200 hover:text-gold-400 transition-colors flex items-center"><span className="mr-2 text-gold-500">•</span> Ceylon Tea</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 font-heading">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <Phone className="text-gold-500 mr-3 mt-1 shrink-0" size={18} />
                                <div>
                                    <p className="text-sm font-semibold text-white">UAE Contact </p>
                                    <p className="text-primary-200 text-sm">+97 154 780 2290</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <Phone className="text-gold-500 mr-3 mt-1 shrink-0" size={18} />
                                <div>
                                    <p className="text-sm font-semibold text-white">Sri Lanka Wearhouse</p>
                                    <p className="text-primary-200 text-sm">+94 76 775 2181</p>
                                    <p className="text-primary-200 text-sm">+94 76 168 0009</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <Mail className="text-gold-500 mr-3 mt-1 shrink-0" size={18} />
                                <p className="text-primary-200 text-sm break-all">exports@greatwayimportexport.com</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-primary-300">
                    <p>&copy; {new Date().getFullYear()} Greatway Import and Exports. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

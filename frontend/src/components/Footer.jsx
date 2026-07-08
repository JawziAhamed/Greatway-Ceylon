import { Phone, MapPin, Mail, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
    return (
        <footer className="bg-primary-900 text-primary-50 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <img src={logo} alt="Greatway Export Logo" className="h-10 w-10 object-contain rounded-full bg-white p-1" />
                            <span className="font-heading font-bold text-2xl text-white">
                                Greatway <span className="text-gold-500">Ceylon</span>
                            </span>
                        </Link>
                        <p className="text-primary-200 text-sm leading-relaxed">
                            Premium exporter of fresh fruits, vegetables, and aromatic spices from Sri Lanka to the United Arab Emirates and beyond.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a
                                href="https://www.instagram.com/greatway_ceylon?igsh=NTQxNzE0OXMzaXNy&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-200 hover:text-white transition-colors bg-primary-800 p-2 rounded-full hover:bg-gold-500 flex items-center justify-center animate-fade-in"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="https://www.tiktok.com/@greatway_ceylon?_r=1&_t=ZS-95yOqzKcEYZ"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-200 hover:text-white transition-colors bg-primary-800 p-2 rounded-full hover:bg-gold-500 flex items-center justify-center animate-fade-in"
                                aria-label="TikTok"
                            >
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path>
                                </svg>
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
                                    <p className="text-sm font-semibold text-white">UAE Contact</p>
                                    <p className="text-primary-200 text-sm">+971 54 780 2290</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <Phone className="text-gold-500 mr-3 mt-1 shrink-0" size={18} />
                                <div>
                                    <p className="text-sm font-semibold text-white">Sri Lanka Warehouse</p>
                                    <p className="text-primary-200 text-sm">+94 76 999 7584</p>
                                    <p className="text-primary-200 text-sm">+94 76 775 2181</p>
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

import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Products', path: '/products' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-effect py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center bg-white/80 backdrop-blur-md rounded-full px-6 py-2 shadow-lg border border-primary-100">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <img src={logo} alt="Greatway Export Logo" className="h-10 w-10 object-contain rounded-full" />
                        <span className="font-heading font-bold text-xl text-primary-900 hidden sm:block">
                            Greatway <span className="text-gold-600">Ceylon</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`font-medium text-sm transition-colors hover:text-primary-600 ${location.pathname === link.path ? 'text-primary-700 border-b-2 border-gold-500' : 'text-gray-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/contact"
                            className="bg-primary-700 text-white px-5 py-2 rounded-full font-medium hover:bg-primary-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Get Quote
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-primary-900 hover:text-primary-600 focus:outline-none bg-primary-50 p-2 rounded-full"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-primary-100 animate-fade-in-up">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-3 rounded-xl text-base font-medium ${location.pathname === link.path
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/contact"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center mt-4 bg-primary-700 text-white px-5 py-3 rounded-xl font-medium shadow-md"
                        >
                            Get Quote
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { submitInquiry } from '../utils/api';

export default function Contact() {
    const [searchParams] = useSearchParams();
    const product = searchParams.get('product') || '';
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        productOfInterest: product,
        message: product
            ? `I am interested in importing ${product}. Please provide availability and pricing details.`
            : ''
    });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');
        try {
            await submitInquiry(formData);
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', productOfInterest: '', message: '' });
        } catch (error) {
            setStatus('error');
            setErrorMsg(error.message || 'Something went wrong. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="animate-fade-in-up bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-primary-900 py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-gold-500 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-primary-500 rounded-full blur-[100px]"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 font-heading">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-primary-200 max-w-2xl mx-auto text-balance">
                        Whether you are looking to place an order or inquire about our products, our team in UAE and Sri Lanka are ready to assist you.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

                    {/* Contact Information Sidebar */}
                    <div className="bg-primary-800 text-white lg:w-1/3 p-10 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-700 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-600 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-8 font-heading">Contact Information</h3>

                            <div className="space-y-8">
                                <div className="flex items-start">
                                    <div className="bg-gold-500/20 p-2 rounded-lg mr-4 shrink-0 mt-0.5">
                                        <Phone className="w-5 h-5 text-gold-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg mb-1 text-primary-50">🇦🇪 UAE(Primary)</h4>
                                        <a href="tel:+94767752181" className="text-primary-200 hover:text-gold-400 transition-colors">
                                            +94 76 775 2181
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-gold-500/20 p-2 rounded-lg mr-4 shrink-0 mt-0.5">
                                        <Phone className="w-5 h-5 text-gold-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg mb-1 text-primary-50">🇱🇰 Sri Lanka Operations</h4>
                                        <a href="tel:+94769997584" className="text-primary-200 hover:text-gold-400 transition-colors block">
                                            +94 76 999 7584
                                        </a>
                                        <a href="tel:+94767752181" className="text-primary-200 hover:text-gold-400 transition-colors block">
                                            +94 76 775 2181
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-gold-500/20 p-2 rounded-lg mr-4 shrink-0 mt-0.5">
                                        <Mail className="w-5 h-5 text-gold-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg mb-1 text-primary-50">Email Inquiry</h4>
                                        <a href="mailto:inquiries@greatwayexport.com" className="text-primary-200 hover:text-gold-400 transition-colors break-all">
                                            inquiries@greatwayexport.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-gold-500/20 p-2 rounded-lg mr-4 shrink-0 mt-0.5">
                                        <MapPin className="w-5 h-5 text-gold-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg mb-1 text-primary-50">Headquarters</h4>
                                        <p className="text-primary-200">Welimada, Sri Lanka</p>
                                        <p className="text-primary-300 mt-1 text-sm">Logistics partners in Dubai, UAE</p>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Direct Link */}
                            <a
                                href="https://wa.me/94725737391?text=Hello%20Greatway%20Exports%2C%20I%20would%20like%20to%20inquire%20about%20your%20products."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-10 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-6 h-6" aria-hidden="true">
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32 101 32 1 132 1 255c0 39.2 10.2 77.5 29.6 111.3L0 480l116.7-30.6c32.4 17.7 68.9 27 106.9 27h.1c122.9 0 222.9-100 222.9-223 0-59.3-23.1-115.1-65.7-156.3ZM223.7 438.7c-33.9 0-67.1-9.1-96-26.2l-6.9-4.1-69.2 18.2 18.5-67.5-4.5-7C46.9 322.4 37 289 37 255 37 151.9 120.9 68 224 68c49.9 0 96.8 19.5 132.1 54.8 35.3 35.4 54.7 82.3 54.7 132.2-.1 103.1-84 183.7-187.1 183.7Zm102.6-137.6c-5.6-2.8-33.2-16.4-38.3-18.2-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18.2-17.6 22-3.2 3.7-6.5 4.2-12.1 1.4-33.2-16.6-55-29.6-76.8-67-5.8-10 5.8-9.3 16.6-30.9 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.7 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 33.2-13.6 37.9-26.7 4.6-13.1 4.6-24.3 3.2-26.7-1.3-2.5-5-3.9-10.6-6.7Z" />
                                </svg>
                                WhatsApp Us Now
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:w-2/3 p-10 lg:p-14 bg-white">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2 font-heading">Send us a Message</h3>
                        <p className="text-gray-500 mb-8">Fill out the form below and we will get back to you with a competitive quote.</p>

                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="bg-green-100 p-5 rounded-full mb-6">
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 font-heading mb-3">Inquiry Submitted!</h4>
                                <p className="text-gray-500 max-w-sm">Thank you for reaching out. Our team will get back to you within 24 hours with a competitive quote.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-6 text-primary-600 font-semibold hover:text-primary-800 transition-colors"
                                >
                                    Submit another inquiry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            placeholder="john@company.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (with Country Code) *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            placeholder="+971 50 123 4567"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="productOfInterest" className="block text-sm font-medium text-gray-700 mb-1">Product of Interest</label>
                                        <select
                                            id="productOfInterest"
                                            name="productOfInterest"
                                            value={formData.productOfInterest}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                                        >
                                            <option value="">Select a product...</option>
                                            <optgroup label="🥥 Fresh Fruits">
                                                <option>King Coconut</option>
                                                <option>Red Lady Papaya</option>
                                                <option>Green Papaya</option>
                                                <option>Avocado</option>
                                                <option>Rambutan</option>
                                                <option>Pineapple</option>
                                            </optgroup>
                                            <optgroup label="🌿 Spices">
                                                <option>Ceylon Cinnamon</option>
                                                <option>Cardamom</option>
                                                <option>Clove</option>
                                                <option>Black Pepper</option>
                                            </optgroup>
                                            <optgroup label="🥦 Vegetables">
                                                <option>Cassava</option>
                                            </optgroup>
                                            <optgroup label="🌰 Nuts">
                                                <option>Cashew Nuts</option>
                                            </optgroup>
                                            <optgroup label="🍃 Tea">
                                                <option>Ceylon Tea Powder</option>
                                            </optgroup>
                                            <option value="Multiple Products">Multiple Products</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Inquiry / Requirements *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                                        placeholder="Please specify product quantities, delivery locations, and any specific requirements..."
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
                                        ⚠️ {errorMsg}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-primary-700 hover:bg-primary-800 disabled:bg-primary-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex justify-center items-center hover:shadow-xl hover:-translate-y-1 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {status === 'loading' ? (
                                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
                                    ) : (
                                        <><Send className="w-5 h-5 mr-2" /> Submit Inquiry</>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Google Map Embed */}
                <div className="mt-12 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                    <div className="bg-white p-6 border-b border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
                            <MapPin className="text-primary-600" /> Our Location – Welimada, Sri Lanka
                        </h3>
                        <p className="text-gray-500 mt-1 text-sm">Export operations based in Welimada with direct logistics to Dubai, UAE.</p>
                    </div>
                    <iframe
                        title="Greatway Exports - Welimada, Sri Lanka"
                        src="https://maps.google.com/maps?q=Welimada,%20Sri%20Lanka&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="400"
                        style={{ border: 0, display: 'block' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}

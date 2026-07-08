import { useState } from 'react';
import { Download, X, Mail, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * CatalogDownloadButton
 *
 * variant: 'default' | 'compact' | 'outline' | 'ghost'
 *
 * To activate the real PDF download:
 * 1. Place your catalog PDF at: /public/catalog.pdf
 * 2. The button will automatically trigger the browser download.
 *
 * While no PDF is available, it shows a polished "coming soon" modal.
 */
const CATALOG_PDF_PATH = '/catalog.pdf';

export default function CatalogDownloadButton({ variant = 'default', className = '' }) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = async () => {
    try {
      const res = await fetch(CATALOG_PDF_PATH, { method: 'HEAD' });
      if (res.ok) {
        // PDF exists — trigger download
        const link = document.createElement('a');
        link.href = CATALOG_PDF_PATH;
        link.download = 'Greatway-Ceylon-Product-Catalog.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setShowModal(true);
      }
    } catch {
      setShowModal(true);
    }
  };

  const buttonContent = (
    <>
      <Download size={variant === 'compact' ? 15 : 18} className="shrink-0" />
      <span>{variant === 'compact' ? 'Catalog' : 'Download Catalog'}</span>
    </>
  );

  const baseClasses = 'inline-flex items-center gap-2 font-semibold transition-all duration-200 cursor-pointer select-none';

  const variantClasses = {
    default:
      'bg-gold-500 hover:bg-gold-400 text-primary-900 px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm',
    compact:
      'bg-gold-500/15 hover:bg-gold-500 text-gold-700 hover:text-primary-900 border border-gold-500/40 hover:border-gold-500 px-3 py-1.5 rounded-full text-xs',
    outline:
      'border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-primary-900 px-6 py-3 rounded-full text-sm',
    ghost:
      'text-gold-500 hover:text-gold-400 underline-offset-4 hover:underline text-sm',
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        id={`catalog-download-${variant}`}
        aria-label="Download Product Catalog"
      >
        {buttonContent}
      </button>

      {/* Coming Soon Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-scale-in"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="catalog-modal-title"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-gold-100 p-5 rounded-2xl">
                <FileText size={40} className="text-gold-600" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h2 id="catalog-modal-title" className="text-2xl font-bold text-primary-900 font-heading mb-3">
                Catalog Coming Soon
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Our comprehensive product catalog is currently being updated with the latest offerings and specifications. In the meantime, please reach out to us directly and we'll send it straight to your inbox.
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Get it via</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                to="/contact"
                onClick={() => setShowModal(false)}
                className="flex items-center justify-between w-full bg-primary-700 hover:bg-primary-800 text-white px-5 py-3.5 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Mail size={18} />
                  <span className="font-semibold">Request via Contact Form</span>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="mailto:exports@greatwayimportexport.com?subject=Product%20Catalog%20Request&body=Hello%2C%20I%20would%20like%20to%20receive%20your%20product%20catalog."
                className="flex items-center justify-between w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-5 py-3.5 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <span className="font-semibold text-sm">exports@greatwayimportexport.com</span>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-gray-400" />
              </a>
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              We typically respond within 24 hours on business days.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

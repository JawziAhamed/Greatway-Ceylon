import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Package,
  Clock,
  Thermometer,
  TrendingUp,
  Award,
  Send,
  ChevronRight,
  Leaf,
  CheckCircle,
  BarChart2,
  Ship,
  Hash,
  Loader2,
} from 'lucide-react';
import { getProductBySlug } from '../data/products';
import { getProduct } from '../utils/api';
import CatalogDownloadButton from '../components/CatalogDownloadButton';

const normalizeProduct = (product, fallbackSlug) => ({
  ...product,
  slug: product.slug || fallbackSlug,
  image: product.image || product.imageUrl,
  desc: product.desc || product.shortDescription || product.description,
  shortDescription: product.shortDescription || product.desc,
  description: product.description || product.desc || product.shortDescription,
  origin: product.origin || 'Sri Lanka',
});

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const fallbackProduct = getProductBySlug(slug);
  const [remoteProduct, setRemoteProduct] = useState({ slug: null, product: null });
  const product = remoteProduct.slug === slug && remoteProduct.product
    ? remoteProduct.product
    : fallbackProduct
      ? normalizeProduct(fallbackProduct, slug)
      : null;
  const loading = !product && remoteProduct.slug !== slug;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    let active = true;

    getProduct(slug)
      .then((data) => {
        if (active) setRemoteProduct({ slug, product: normalizeProduct(data, slug) });
      })
      .catch(() => {
        if (active) setRemoteProduct({ slug, product: null });
      });

    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin mb-4" />
        <h1 className="text-2xl font-bold text-primary-900 font-heading">Loading product</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="bg-primary-100 p-6 rounded-full mb-6">
          <Leaf size={48} className="text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-primary-900 font-heading mb-3">Product Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          The product you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-primary-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-800 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Products
        </Link>
      </div>
    );
  }

  const specRows = [
    { icon: <Package size={16} />, label: 'Category', value: product.category },
    {
      icon: <CheckCircle size={16} />,
      label: 'Catalog Status',
      value: product.exportAvailability === false ? 'Unavailable for public catalog' : 'Available for public catalog',
    },
    { icon: <MapPin size={16} />, label: 'Country of Origin', value: product.origin },
    { icon: <Hash size={16} />, label: 'HS Code', value: product.hsCode },
    { icon: <Clock size={16} />, label: 'Availability', value: product.availability },
    { icon: <Package size={16} />, label: 'Packaging / Labelling', value: product.packaging },
    { icon: <Clock size={16} />, label: 'Approx. Shelf Life', value: product.shelfLife },
    { icon: <Thermometer size={16} />, label: 'Storage & Handling', value: product.storage },
    { icon: <TrendingUp size={16} />, label: 'Supply Capacity', value: product.supplyCapacity },
    { icon: <BarChart2 size={16} />, label: 'Price', value: product.price },
  ];

  return (
    <div className="bg-gray-50 min-h-screen animate-fade-in-up">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
            <ChevronRight size={14} />
            <span className="text-primary-700 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div className="relative bg-primary-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/80 to-primary-900/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span className="inline-block bg-gold-500/20 text-gold-400 border border-gold-500/40 text-xs font-bold px-3 py-1 rounded-full mb-4">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white font-heading mb-2">
              {product.name}
            </h1>
            {product.shortDescription && (
              <p className="text-primary-100 text-lg leading-relaxed max-w-3xl mb-3">
                {product.shortDescription}
              </p>
            )}
            {product.scientificName && (
              <p className="text-primary-300 italic text-lg">{product.scientificName}</p>
            )}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="self-start sm:self-auto flex items-center gap-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium transition-all"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Left Column: Image + Quick Actions ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 group">
              <div className="relative overflow-hidden h-80 lg:h-96">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary-800 text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  {product.category}
                </div>
              </div>
              <div className="p-5 bg-primary-50 border-t border-primary-100">
                <div className="flex items-center gap-2 text-primary-700">
                  <MapPin size={14} />
                  <span className="text-sm font-semibold">Origin: {product.origin}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to={`/contact?product=${encodeURIComponent(product.name)}`}
                className="flex items-center justify-center gap-2 w-full bg-primary-700 hover:bg-primary-800 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                id={`inquiry-btn-${product.slug}`}
              >
                <Send size={18} /> Send Inquiry for This Product
              </Link>
              <CatalogDownloadButton variant="outline" className="w-full justify-center py-3.5 rounded-2xl" />
            </div>

            {/* Certifications */}
            {product.certifications && product.certifications.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={16} className="text-gold-500" /> Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1.5 rounded-full"
                    >
                      <CheckCircle size={12} /> {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Export Info */}
            {product.exportInfo && (
              <div className="bg-primary-900 rounded-2xl p-5 text-primary-100">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Ship size={16} className="text-gold-400" /> Export Information
                </h3>
                <p className="text-sm leading-relaxed">{product.exportInfo}</p>
              </div>
            )}
          </div>

          {/* ── Right Column: Details ── */}
          <div className="lg:col-span-3 space-y-8">

            {/* Description */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary-100 p-2 rounded-xl">
                  <Leaf size={18} className="text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 font-heading">Description</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>
            </div>

            {/* Specifications Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-7 py-5 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900 font-heading">Product Specifications</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {specRows.filter(r => r.value).map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4 px-7 py-4 hover:bg-primary-50/50 transition-colors">
                    <div className="text-gray-400 mt-0.5 shrink-0">{icon}</div>
                    <div className="flex flex-col sm:flex-row sm:gap-8 min-w-0 flex-1">
                      <span className="text-sm font-semibold text-gray-500 sm:w-44 shrink-0">{label}</span>
                      <span className="text-sm text-gray-800 leading-relaxed">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Panel */}
            {product.nutrition && Object.keys(product.nutrition).length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-7 py-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Nutritional Information</h2>
                  {product.nutritionPer && (
                    <span className="text-xs text-gray-500 text-right">{product.nutritionPer}</span>
                  )}
                </div>
                <div className="p-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0">
                    {Object.entries(product.nutrition).map(([key, val], i) => (
                      <div
                        key={key}
                        className={`flex items-center justify-between py-2.5 border-b border-dashed border-gray-100 ${
                          i === Object.entries(product.nutrition).length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <span className="text-sm text-gray-500">{key}</span>
                        <span className="text-sm font-semibold text-gray-800">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-3xl border border-primary-100 p-7">
                <h2 className="text-xl font-bold text-gray-900 font-heading mb-5 flex items-center gap-2">
                  <CheckCircle size={20} className="text-primary-600" /> Key Benefits
                </h2>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="bg-primary-600 text-white rounded-full p-0.5 shrink-0 mt-0.5">
                        <CheckCircle size={14} />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="bg-primary-900 rounded-3xl p-7 text-center">
              <h3 className="text-xl font-bold text-white font-heading mb-2">
                Interested in {product.name}?
              </h3>
              <p className="text-primary-300 text-sm mb-6 leading-relaxed">
                Get in touch with us for pricing, availability, and customized export solutions tailored to your business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-primary-900 font-bold px-6 py-3 rounded-full transition-all hover:-translate-y-0.5 shadow-lg"
                >
                  <Send size={16} /> Request a Quote
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-full transition-all"
                >
                  <ArrowLeft size={16} /> Browse More Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

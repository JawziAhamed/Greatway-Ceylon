import { CheckCircle, Shield, Globe2, Leaf, ThumbsUp, Medal } from 'lucide-react';

export default function About() {
    const values = [
        {
            icon: <Leaf className="w-8 h-8 text-primary-500" />,
            title: "100% Organic & Fresh",
            description: "Sourced from the finest farms in Sri Lanka, our produce is packed with natural goodness and flavor."
        },
        {
            icon: <Shield className="w-8 h-8 text-primary-500" />,
            title: "Quality Assured",
            description: "Stringent quality control processes at every stage, from harvesting to packaging and export."
        },
        {
            icon: <Globe2 className="w-8 h-8 text-primary-500" />,
            title: "Global Reach, Local Touch",
            description: "Expert logistics ensuring timely delivery to the UAE while supporting local Sri Lankan farmers."
        },
        {
            icon: <ThumbsUp className="w-8 h-8 text-primary-500" />,
            title: "Sustainable Practices",
            description: "Committed to eco-friendly farming and packaging solutions to minimize our environmental impact."
        }
    ];

    return (
        <div className="animate-fade-in-up bg-white">
            {/* Hero Section */}
            <section className="relative py-24 bg-primary-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-gold-500 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-primary-500 rounded-full blur-[100px]"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 font-heading">
                        Our Story & Heritage
                    </h1>
                    <p className="mt-4 max-w-3xl text-xl text-primary-100 mx-auto leading-relaxed text-balance">
                        Rooted in the lush, fertile landscapes of Sri Lanka, Greatway Import and Exports is built on a passion for sharing Nature's finest bounties with the world.
                    </p>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gold-100 rounded-3xl transform -rotate-3 z-0"></div>
                            <img
                                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop"
                                alt="Agricultural fields in Sri Lanka"
                                className="relative z-10 rounded-2xl shadow-xl w-full h-[500px] object-cover"
                            />
                            
                        </div>

                        <div className="space-y-10">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-4 font-heading">Our Mission</h2>
                                <div className="flex">
                                    <div className="shrink-0 mt-1 mr-4">
                                        <CheckCircle className="h-6 w-6 text-gold-500" />
                                    </div>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        To be the leading and most trusted exporter of premium Sri Lankan agricultural products to the UAE, fostering sustainable farming practices and delivering unparalleled quality and service to our partners worldwide.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-4 font-heading">Our Vision</h2>
                                <div className="flex">
                                    <div className="shrink-0 mt-1 mr-4">
                                        <CheckCircle className="h-6 w-6 text-gold-500" />
                                    </div>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        To bridge the gap between fresh Sri Lankan harvest and global markets, enriching lives through healthy, organic food while uplifting rural farming communities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                    <h2 className="text-base text-gold-600 font-semibold tracking-wide uppercase">Core principles</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-heading">
                        Our Quality Standards
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        We adhere to rigorous international standards to ensure that every shipment maintains its peak freshness and flavor profile upon arrival in the UAE.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}

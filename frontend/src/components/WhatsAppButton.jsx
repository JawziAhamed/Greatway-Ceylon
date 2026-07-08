import whatsappIcon from '../assets/whatsapp-icon.png';

export default function WhatsAppButton() {
    const whatsappNumber = "+971547802290"; // UAE number
    const whatsappMessage = encodeURIComponent("Hello Greatway Exports, I would like to inquire about your products.");

    return (
        <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 inline-flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 animate-bounce group"
            aria-label="Chat on WhatsApp"
        >
            <img
                src={whatsappIcon}
                alt=""
                className="h-16 w-16 object-contain drop-shadow-2xl"
                aria-hidden="true"
            />
            {/* Tooltip */}
            <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat with us!
            </span>
        </a>
    );
}

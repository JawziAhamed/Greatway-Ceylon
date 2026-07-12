const DEFAULT_GRAPH_VERSION = 'v23.0';
const DEFAULT_TEMPLATE_LANGUAGE = 'en_US';

const normalizePhoneNumber = (number) => {
    if (!number) return '';
    return number.replace(/^whatsapp:/i, '').replace(/\D/g, '');
};

const getSubmittedAt = (inquiry) => {
    const submittedAt = inquiry.createdAt || new Date();
    return new Date(submittedAt).toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
};

const getWhatsAppConfig = () => ({
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN?.trim(),
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID?.trim(),
    graphVersion: (process.env.WHATSAPP_GRAPH_VERSION || DEFAULT_GRAPH_VERSION).trim(),
    adminNumber: normalizePhoneNumber(
        process.env.WHATSAPP_ADMIN_NUMBER || process.env.OFFICIAL_WHATSAPP_NUMBER
    ),
    templateName: process.env.WHATSAPP_TEMPLATE_NAME?.trim(),
    templateLanguage: (process.env.WHATSAPP_TEMPLATE_LANGUAGE || DEFAULT_TEMPLATE_LANGUAGE).trim(),
    bypassEnabled: process.env.BYPASS_WHATSAPP_NOTIFICATION === 'true',
});

const maskValue = (value = '') => {
    if (!value) return 'not_configured';
    if (value.length <= 6) return `${value[0]}***${value[value.length - 1]}`;
    return `${value.slice(0, 3)}***${value.slice(-4)}`;
};

const getMetaMessagesEndpoint = (config) =>
    `https://graph.facebook.com/${config.graphVersion}/${config.phoneNumberId}/messages`;

const buildInquiryTextMessage = (inquiry) => (
    `New Inquiry - Greatway Ceylon\n\n` +
    `Name: ${inquiry.name}\n` +
    `Email: ${inquiry.email}\n` +
    `Phone: ${inquiry.phone}\n` +
    `Product: ${inquiry.productOfInterest || 'General Inquiry'}\n` +
    `Message: ${inquiry.message}\n` +
    `Submitted: ${getSubmittedAt(inquiry)}`
);

const getTemplateParameters = (inquiry) => ([
    { type: 'text', text: inquiry.name || 'Customer' },
    { type: 'text', text: inquiry.email || 'Not provided' },
    { type: 'text', text: inquiry.phone || 'Not provided' },
    { type: 'text', text: inquiry.productOfInterest || 'General Inquiry' },
    { type: 'text', text: inquiry.message || 'No message provided' },
    { type: 'text', text: getSubmittedAt(inquiry) },
]);

const buildInquiryPayload = (inquiry, config) => {
    if (config.templateName) {
        return {
            messaging_product: 'whatsapp',
            to: config.adminNumber,
            type: 'template',
            template: {
                name: config.templateName,
                language: {
                    code: config.templateLanguage,
                },
                components: [
                    {
                        type: 'body',
                        parameters: getTemplateParameters(inquiry),
                    },
                ],
            },
        };
    }

    return {
        messaging_product: 'whatsapp',
        to: config.adminNumber,
        type: 'text',
        text: {
            preview_url: false,
            body: buildInquiryTextMessage(inquiry),
        },
    };
};

const getMissingConfig = (config) => {
    const missing = [];
    if (!config.accessToken) missing.push('WHATSAPP_ACCESS_TOKEN');
    if (!config.phoneNumberId) missing.push('WHATSAPP_PHONE_NUMBER_ID');
    if (!config.adminNumber) missing.push('WHATSAPP_ADMIN_NUMBER');
    return missing;
};

const sendInquiryNotification = async (inquiry) => {
    const config = getWhatsAppConfig();

    if (config.bypassEnabled) {
        console.warn('[WhatsApp Cloud API] Notification bypass enabled. Skipping inquiry notification.');
        return { sent: false, skipped: true, reason: 'bypass_enabled' };
    }

    const missingConfig = getMissingConfig(config);
    if (missingConfig.length > 0) {
        console.warn(`[WhatsApp Cloud API] Missing ${missingConfig.join(', ')}. Skipping inquiry notification.`);
        return { sent: false, skipped: true, reason: 'missing_config', missingConfig };
    }

    const endpoint = getMetaMessagesEndpoint(config);
    const payload = buildInquiryPayload(inquiry, config);

    console.info('[WhatsApp Cloud API] Request configuration', {
        endpoint,
        method: 'POST',
        graphVersion: config.graphVersion,
        phoneNumberId: config.phoneNumberId,
        adminNumber: maskValue(config.adminNumber),
        messageType: payload.type,
        templateName: config.templateName || null,
        templateLanguage: config.templateName ? config.templateLanguage : null,
        accessTokenConfigured: Boolean(config.accessToken),
    });

    let response;
    try {
        response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${config.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error('[WhatsApp Cloud API] Network request failed before Meta returned a response', {
            endpoint,
            graphVersion: config.graphVersion,
            phoneNumberId: config.phoneNumberId,
            adminNumber: maskValue(config.adminNumber),
            errorName: error.name,
            errorMessage: error.message,
            causeCode: error.cause?.code,
            causeMessage: error.cause?.message,
        });
        throw error;
    }

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        const apiMessage = result.error?.message || 'Unknown WhatsApp Cloud API error';
        const apiCode = result.error?.code ? ` code ${result.error.code}` : '';
        throw new Error(`WhatsApp Cloud API request failed with status ${response.status}${apiCode}: ${apiMessage}`);
    }

    const messageId = result.messages?.[0]?.id;
    console.log(`[WhatsApp Cloud API] Inquiry notification sent to +${config.adminNumber}${messageId ? ` (${messageId})` : ''}.`);

    return { sent: true, skipped: false, messageId, response: result };
};

module.exports = {
    buildInquiryPayload,
    sendInquiryNotification,
};

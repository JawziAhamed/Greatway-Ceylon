const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (auth = false) => {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
        const token = localStorage.getItem('adminToken');
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const throwApiError = async (res, fallbackMessage) => {
    let message = fallbackMessage;
    try {
        const data = await res.json();
        message = data.message || message;
    } catch {
        // Keep the fallback message if the server did not return JSON.
    }

    const error = new Error(message);
    error.status = res.status;
    throw error;
};

// --- Inquiries ---
export const submitInquiry = async (data) => {
    const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) await throwApiError(res, 'Failed to submit inquiry');
    return res.json();
};

export const getInquiries = async () => {
    const res = await fetch(`${API_BASE}/inquiries`, {
        headers: getHeaders(true),
    });
    if (!res.ok) await throwApiError(res, 'Failed to fetch inquiries');
    return res.json();
};

export const updateInquiryStatus = async (id, status) => {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify({ status }),
    });
    if (!res.ok) await throwApiError(res, 'Failed to update inquiry');
    return res.json();
};

export const deleteInquiry = async (id) => {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
    });
    if (!res.ok) await throwApiError(res, 'Failed to delete inquiry');
    return res.json();
};

// --- Products ---
export const getProducts = async ({ includeUnavailable = false } = {}) => {
    const query = includeUnavailable ? '?includeUnavailable=true' : '';
    const res = await fetch(`${API_BASE}/products${query}`, {
        headers: getHeaders(includeUnavailable),
    });
    if (!res.ok) await throwApiError(res, 'Failed to fetch products');
    return res.json();
};

export const getProduct = async (identifier) => {
    const res = await fetch(`${API_BASE}/products/${identifier}`, { headers: getHeaders() });
    if (!res.ok) await throwApiError(res, 'Failed to fetch product');
    return res.json();
};

export const createProduct = async (data) => {
    const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(data),
    });
    if (!res.ok) await throwApiError(res, 'Failed to create product');
    return res.json();
};

export const updateProduct = async (id, data) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
    });
    if (!res.ok) await throwApiError(res, 'Failed to update product');
    return res.json();
};

export const deleteProduct = async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
    });
    if (!res.ok) await throwApiError(res, 'Failed to delete product');
    return res.json();
};

// --- Admin Auth ---
export const adminLogin = async (username, password) => {
    const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) await throwApiError(res, 'Login failed');
    return res.json();
};

export const getAdminProfile = async () => {
    const res = await fetch(`${API_BASE}/admin/profile`, {
        headers: getHeaders(true),
    });
    if (!res.ok) await throwApiError(res, 'Failed to fetch admin profile');
    return res.json();
};

export const updateAdminProfile = async (data) => {
    const res = await fetch(`${API_BASE}/admin/profile`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
    });
    if (!res.ok) await throwApiError(res, 'Failed to update admin profile');
    return res.json();
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (auth = false) => {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
        const token = localStorage.getItem('adminToken');
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// --- Inquiries ---
export const submitInquiry = async (data) => {
    const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to submit inquiry');
    return res.json();
};

export const getInquiries = async () => {
    const res = await fetch(`${API_BASE}/inquiries`, {
        headers: getHeaders(true),
    });
    if (!res.ok) throw new Error('Failed to fetch inquiries');
    return res.json();
};

export const updateInquiryStatus = async (id, status) => {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update inquiry');
    return res.json();
};

export const deleteInquiry = async (id) => {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
    });
    if (!res.ok) throw new Error('Failed to delete inquiry');
    return res.json();
};

// --- Products ---
export const getProducts = async ({ includeUnavailable = false } = {}) => {
    const query = includeUnavailable ? '?includeUnavailable=true' : '';
    const res = await fetch(`${API_BASE}/products${query}`, {
        headers: getHeaders(includeUnavailable),
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const getProduct = async (identifier) => {
    const res = await fetch(`${API_BASE}/products/${identifier}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
};

export const createProduct = async (data) => {
    const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to create product');
    return res.json();
};

export const updateProduct = async (id, data) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to update product');
    return res.json();
};

export const deleteProduct = async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete product');
    return res.json();
};

// --- Admin Auth ---
export const adminLogin = async (username, password) => {
    const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
    return res.json();
};

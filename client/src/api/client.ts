import axios, { AxiosRequestConfig } from 'axios';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_ORDERS } from './mocks/mockData';
import { Product } from '../types/catalog';
import { Order, CreateOrderPayload } from '../types/order';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const FORCE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// In-memory / localStorage state for persistent mock orders & products
let mockOrdersState: Order[] = (() => {
  try {
    const saved = localStorage.getItem('mini_ecom_mock_orders');
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  } catch {
    return MOCK_ORDERS;
  }
})();

let mockProductsState: Product[] = (() => {
  try {
    const saved = localStorage.getItem('mini_ecom_mock_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  } catch {
    return MOCK_PRODUCTS;
  }
})();

function saveMockState() {
  try {
    localStorage.setItem('mini_ecom_mock_orders', JSON.stringify(mockOrdersState));
    localStorage.setItem('mini_ecom_mock_products', JSON.stringify(mockProductsState));
  } catch (e) {
    console.warn('Failed to save mock state to localStorage', e);
  }
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mini_ecom_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and standard errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mini_ecom_token');
      localStorage.removeItem('mini_ecom_user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Universal Mock Handler for seamless offline / demo operation
 */
export async function fetchWithMockFallback<T>(
  requestFn: () => Promise<{ data: T }>,
  mockHandler: () => T | Promise<T>
): Promise<T> {
  if (FORCE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockHandler();
  }

  try {
    const response = await requestFn();
    return response.data;
  } catch (error: any) {
    // If backend connection refused or 404, fallback to realistic mock layer
    if (!error.response || error.code === 'ECONNREFUSED' || error.response?.status >= 500 || error.response?.status === 404) {
      console.info('API unavailable or in mock mode. Serving localized mock data.');
      await new Promise((resolve) => setTimeout(resolve, 250));
      return mockHandler();
    }
    const message = error.response?.data?.message || error.message || 'Network error';
    throw new Error(message);
  }
}

// ==========================================
// Catalog API Functions
// ==========================================

export const catalogApi = {
  getCategories: async () => {
    return fetchWithMockFallback(
      () => apiClient.get('/categories'),
      () => MOCK_CATEGORIES
    );
  },

  getProducts: async (params?: { category?: string; search?: string }) => {
    return fetchWithMockFallback(
      () => apiClient.get('/products', { params }),
      () => {
        let result = [...mockProductsState];

        if (params?.category && params.category !== 'All') {
          result = result.filter((p) => {
            const catName = typeof p.category === 'object' ? p.category.name : p.category;
            return catName?.toLowerCase() === params.category?.toLowerCase();
          });
        }

        if (params?.search) {
          const query = params.search.toLowerCase().trim();
          result = result.filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              p.description.toLowerCase().includes(query) ||
              p.tags?.some((t) => t.toLowerCase().includes(query))
          );
        }

        return result;
      }
    );
  },

  getProductById: async (id: string) => {
    return fetchWithMockFallback(
      () => apiClient.get(`/products/${id}`),
      () => {
        const product = mockProductsState.find((p) => p._id === id);
        if (!product) {
          throw new Error('Product not found in catalog');
        }
        return product;
      }
    );
  },
};

// ==========================================
// Order API Functions
// ==========================================

export const orderApi = {
  createOrder: async (payload: CreateOrderPayload) => {
    return fetchWithMockFallback(
      () => apiClient.post('/orders', payload),
      () => {
        // Calculate server-side total and verify stock
        let calculatedTotal = 0;
        const populatedItems = payload.products.map((item) => {
          const matchedProduct = mockProductsState.find((p) => p._id === item.product);
          if (!matchedProduct) {
            throw new Error(`Product ${item.product} not found`);
          }
          if (matchedProduct.stock < item.quantity) {
            throw new Error(`Insufficient stock for "${matchedProduct.name}". Available: ${matchedProduct.stock}`);
          }

          // Deduct stock atomically in mock state
          matchedProduct.stock -= item.quantity;
          calculatedTotal += matchedProduct.price * item.quantity;

          return {
            product: matchedProduct._id,
            name: matchedProduct.name,
            price: matchedProduct.price,
            quantity: item.quantity,
            image: matchedProduct.image,
          };
        });

        const newOrder: Order = {
          _id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          user: 'usr-customer-active',
          products: populatedItems,
          shippingAddress: payload.shippingAddress,
          paymentMethod: payload.paymentMethod || 'Cash on Delivery',
          totalAmount: calculatedTotal,
          status: 'Pending',
          createdAt: new Date().toISOString(),
        };

        mockOrdersState.unshift(newOrder);
        saveMockState();
        return newOrder;
      }
    );
  },

  getMyOrders: async () => {
    return fetchWithMockFallback(
      () => apiClient.get('/orders/my-orders'),
      () => [...mockOrdersState]
    );
  },

  getOrderById: async (orderId: string) => {
    return fetchWithMockFallback(
      () => apiClient.get(`/orders/${orderId}`),
      () => {
        const order = mockOrdersState.find((o) => o._id === orderId);
        if (!order) throw new Error('Order not found');
        return order;
      }
    );
  },
};

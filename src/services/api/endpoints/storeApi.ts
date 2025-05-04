
import api, { handleResponse } from '../index';

// Store related endpoints
export const storeApi = {
  getProducts: (page = 1, limit = 10, category = '') => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category ? { category } : {})
    });
    return handleResponse(api.get(`/store/products?${queryParams}`));
  },
  
  getProductById: (productId: string) => 
    handleResponse(api.get(`/store/products/${productId}`)),
  
  createProduct: (productData: any) => 
    handleResponse(api.post('/store/products', productData)),
  
  updateProduct: (productId: string, data: any) => 
    handleResponse(api.put(`/store/products/${productId}`, data)),
  
  deleteProduct: (productId: string) => 
    handleResponse(api.delete(`/store/products/${productId}`)),
  
  createOrder: (orderData: any) => 
    handleResponse(api.post('/store/orders', orderData)),
  
  getOrders: (page = 1, limit = 10, userId = '') => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(userId ? { userId } : {})
    });
    return handleResponse(api.get(`/store/orders?${queryParams}`));
  },
  
  getOrderById: (orderId: string) => 
    handleResponse(api.get(`/store/orders/${orderId}`)),
  
  updateOrderStatus: (orderId: string, status: string) => 
    handleResponse(api.put(`/store/orders/${orderId}/status`, { status })),
};

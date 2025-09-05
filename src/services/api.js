const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  async fetchProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products/`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async fetchProductById(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async fetchStores() {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/`);
      if (!response.ok) {
        throw new Error('Failed to fetch stores');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  }

  async fetchStoreProducts(storeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/${storeId}/products/`);
      if (!response.ok) {
        throw new Error('Failed to fetch store products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching store products:', error);
      throw error;
    }
  }

  async fetchUserStores(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/stores/`);
      if (!response.ok) {
        throw new Error('Failed to fetch user stores');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user stores:', error);
      throw error;
    }
  }
}

export default new ApiService();
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.storic.shop/api' 
  : 'http://localhost:8000/api';

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
      console.log(response);
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

  // Cart API methods
  async getCart() {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/`, {
        credentials: 'include' // Include cookies for session
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  async getCSRFToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/csrf/`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        return data.csrf_token;
      }
    } catch (error) {
      console.error('Error getting CSRF token:', error);
    }
    return null;
  }

  async addToCart(productId, quantity = 1) {
    try {
      const csrfToken = await this.getCSRFToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      const response = await fetch(`${API_BASE_URL}/cart/add/`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity
        })
      });
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async updateCartItem(productId, quantity) {
    try {
      const csrfToken = await this.getCSRFToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      const response = await fetch(`${API_BASE_URL}/cart/item/${productId}/`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({ quantity })
      });
      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  async removeFromCart(productId) {
    try {
      const csrfToken = await this.getCSRFToken();
      const headers = {};
      
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}/`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      return await response.json();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async clearCart() {
    try {
      const csrfToken = await this.getCSRFToken();
      const headers = {};
      
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      const response = await fetch(`${API_BASE_URL}/cart/clear/`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      return await response.json();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  async createOrder(orderData) {
    try {
      const csrfToken = await this.getCSRFToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      const response = await fetch(`${API_BASE_URL}/orders/create/`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(orderData)
      });
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async checkout(orderData) {
    try {
      const csrfToken = await this.getCSRFToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      const response = await fetch(`${API_BASE_URL}/cart/checkout/`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(orderData)
      });
      if (!response.ok) {
        throw new Error('Failed to checkout');
      }
      return await response.json();
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  }
}

export default new ApiService();
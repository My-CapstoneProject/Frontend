// API endpoints configuration
const API_ENDPOINTS = {
  // Development endpoints (JSON Server)
  DEV: {
    AUTH: '/api/users',
    PRODUCTS: '/api/products', 
    STORES: '/api/stores',
    INVENTORY: '/api/inventory',
    ORDERS: '/api/orders',
    PENDING_USERS: '/api/pending_users',
    USERS: '/api/users'
  },
  // Production endpoints
  PROD: {
    AUTH: '/api/auth',
    PRODUCTS: '/api/products',
    STORES: '/api/stores', 
    INVENTORY: '/api/inventory',
    ORDERS: '/api/orders'
  }
};

export const ENDPOINTS = API_ENDPOINTS.DEV;

// Helper function for making authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  console.log("Fetching URL:", url);
  console.log("Options:", options);

  const token = localStorage.getItem('token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
      credentials: 'include'
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Auth Services
export const authService = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${ENDPOINTS.AUTH}?username=${credentials.username}`);
      const users = await response.json();
      
      const user = users[0];
      if (!user || user.password !== credentials.password) {
        throw new Error('Invalid credentials');
      }

      // Simulate token creation
      const token = btoa(JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // Store user data
      
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        storeId: user.storeId
      };
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  signup: async (userData) => {
    try {
      // For testing, store new users in pending_users
      const response = await fetch(ENDPOINTS.PENDING_USERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          id: Date.now().toString(),
          status: 'PENDING',
          role: 'SHOPKEEPER', // Force role to be SHOPKEEPER
        }),
      });
      
      return response.json();
    } catch (error) {
      throw new Error('Signup failed');
    }
  },

  getPendingUsers: async () => {
    try {
      const response = await fetch(ENDPOINTS.PENDING_USERS);
      return response.json();
    } catch (error) {
      throw new Error('Failed to fetch pending users');
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      const response = await fetch(`${ENDPOINTS.PENDING_USERS}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      return response.json();
    } catch (error) {
      throw new Error('Failed to update user status');
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  getUserStats: async (timeRange) => {
    // Return mock data directly without making HTTP request
    return [
      { date: '2024-03-01', count: 15, activeCount: 120 },
      { date: '2024-03-02', count: 12, activeCount: 125 },
      { date: '2024-03-03', count: 18, activeCount: 130 },
      { date: '2024-03-04', count: 22, activeCount: 140 },
      { date: '2024-03-05', count: 20, activeCount: 145 },
    ];
  },

  getAll: async () => {
    try {
      const response = await fetch(ENDPOINTS.USERS); // Direct fetch without fetchWithAuth
      const users = await response.json();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getAllUsers: () => fetchWithAuth(`${ENDPOINTS.USERS}`),
  
  deleteUser: (id) => fetchWithAuth(`${ENDPOINTS.USERS}/${id}`, {
    method: 'DELETE'
  }),

  updateUser: (id, data) => fetchWithAuth(`${ENDPOINTS.USERS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  createUser: (userData) => fetchWithAuth(ENDPOINTS.USERS, {
    method: 'POST',
    body: JSON.stringify(userData)
  })
};

// Product Services
export const productService = {
  getAll: () => fetchWithAuth(ENDPOINTS.PRODUCTS),
  
  getByStore: (storeId) => 
    fetchWithAuth(`${ENDPOINTS.PRODUCTS}?storeId=${storeId}`),
  
  create: async (product) => {
    try {
      const response = await fetchWithAuth(ENDPOINTS.PRODUCTS, {
        method: 'POST',
        body: JSON.stringify({
          ...product,
          id: Date.now().toString(),
          status: 'ACTIVE'
        }),
      });
      return response;
    } catch (error) {
      throw new Error('Failed to create product');
    }
  },

  update: (id, data) =>
    fetchWithAuth(`${ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    fetchWithAuth(`${ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'DELETE',
    }),
};

// Inventory Services
export const inventoryService = {
  getAll: () => fetchWithAuth(ENDPOINTS.INVENTORY),
  
  getByStore: (storeId) => 
    fetchWithAuth(`${ENDPOINTS.INVENTORY}?storeId=${storeId}`),
  
  create: (inventoryItem) =>
    fetchWithAuth(ENDPOINTS.INVENTORY, {
      method: 'POST',
      body: JSON.stringify({
        id: Date.now().toString(),
        ...inventoryItem,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      }),
    }),

  update: (id, data) =>
    fetchWithAuth(`${ENDPOINTS.INVENTORY}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  updateQuantity: (id, quantity) =>
    fetchWithAuth(`${ENDPOINTS.INVENTORY}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),
};

// Order Services
export const orderService = {
  getAll: async () => {
    try {
      const response = await fetchWithAuth(`${ENDPOINTS.ORDERS}`);
      // Mock data for development since endpoints aren't ready
      return [
        {
          id: '1',
          storeId: 'STORE001',
          createdAt: '2024-03-20T10:00:00Z',
          totalAmount: 156.50,
          items: [
            {
              id: '1',
              productName: 'Organic Bananas',
              quantity: 3,
              price: 2.50
            },
            {
              id: '2',
              productName: 'Whole Milk',
              quantity: 2,
              price: 4.25
            }
          ]
        },
        {
          id: '2',
          storeId: 'STORE002',
          createdAt: '2024-03-19T15:30:00Z',
          totalAmount: 89.99,
          items: [
            {
              id: '3',
              productName: 'Wheat Bread',
              quantity: 1,
              price: 3.99
            },
            {
              id: '4',
              productName: 'Chicken Breast',
              quantity: 2,
              price: 8.50
            }
          ]
        },
        {
          id: '3',
          storeId: 'STORE001',
          createdAt: '2024-03-18T09:15:00Z',
          totalAmount: 245.75,
          items: [
            {
              id: '5',
              productName: 'Fresh Vegetables Mix',
              quantity: 5,
              price: 12.99
            },
            {
              id: '6',
              productName: 'Orange Juice',
              quantity: 3,
              price: 5.99
            }
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await fetchWithAuth(`${ENDPOINTS.ORDERS}/${id}`);
      return response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },
  
  create: async (orderData) => {
    try {
      const response = await fetchWithAuth(ENDPOINTS.ORDERS, {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      return response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  update: async (id, orderData) => {
    try {
      const response = await fetchWithAuth(`${ENDPOINTS.ORDERS}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(orderData)
      });
      return response.json();
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  getByStore: async (storeId) => {
    try {
      const response = await fetchWithAuth(`${ENDPOINTS.ORDERS}?storeId=${storeId}`);
      // Mock data for development
      return [
        {
          id: '1',
          storeId: storeId,
          createdAt: '2024-03-20T10:00:00Z',
          totalAmount: 156.50,
          status: 'COMPLETED',
          items: [
            {
              id: '1',
              productName: 'Organic Bananas',
              quantity: 3,
              price: 2.50
            },
            {
              id: '2',
              productName: 'Whole Milk',
              quantity: 2,
              price: 4.25
            }
          ]
        },
        {
          id: '2',
          storeId: storeId,
          createdAt: '2024-03-19T15:30:00Z',
          totalAmount: 89.99,
          status: 'PENDING',
          items: [
            {
              id: '3',
              productName: 'Wheat Bread',
              quantity: 1,
              price: 3.99
            },
            {
              id: '4',
              productName: 'Chicken Breast',
              quantity: 2,
              price: 8.50
            }
          ]
        }
      ].filter(order => order.storeId === storeId);
    } catch (error) {
      console.error('Error fetching store orders:', error);
      throw error;
    }
  },

  getOrderStats: async (timeRange, storeId = null) => {
    // Return mock data directly
    const mockData = [
      { date: '2024-03-01', count: 45, revenue: 2500 },
      { date: '2024-03-02', count: 52, revenue: 3200 },
      { date: '2024-03-03', count: 48, revenue: 2800 },
      { date: '2024-03-04', count: 60, revenue: 4100 },
      { date: '2024-03-05', count: 55, revenue: 3600 },
    ];

    // If storeId is provided, filter or adjust the data
    if (storeId) {
      return mockData.map(item => ({
        ...item,
        count: Math.floor(item.count / 2),
        revenue: Math.floor(item.revenue / 2)
      }));
    }

    return mockData;
  },

  getRevenueStats: async (timeRange, storeId = null) => {
    // Return mock data directly
    const mockData = [
      { date: '2024-03-01', amount: 2500 },
      { date: '2024-03-02', amount: 3200 },
      { date: '2024-03-03', amount: 2800 },
      { date: '2024-03-04', amount: 4100 },
      { date: '2024-03-05', amount: 3600 },
    ];

    // If storeId is provided, adjust the amounts
    if (storeId) {
      return mockData.map(item => ({
        ...item,
        amount: Math.floor(item.amount / 2)
      }));
    }

    return mockData;
  }
};

// Store Services
export const storeService = {
  getAll: () => fetchWithAuth(ENDPOINTS.STORES),
  
  getById: (id) => fetchWithAuth(`${ENDPOINTS.STORES}/${id}`),
  
  create: (store) => fetchWithAuth(ENDPOINTS.STORES, {
    method: 'POST',
    body: JSON.stringify(store)
  }),
  
  update: (id, data) => fetchWithAuth(`${ENDPOINTS.STORES}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  
  getPendingStores: async () => {
    const response = await fetchWithAuth(`${ENDPOINTS.STORES}?status=PENDING`);
    return response;
  },
  
  approveStore: async (id) => {
    return fetchWithAuth(`${ENDPOINTS.STORES}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ACTIVE' })
    });
  },
  
  updateStore: (id, data) => fetchWithAuth(`${ENDPOINTS.STORES}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  getStoresRevenue: async (timeRange) => {
    // Return mock data directly
    return [
      { date: '2024-03-01', revenue: 1200, storeCount: 5 },
      { date: '2024-03-02', revenue: 1500, storeCount: 6 },
      { date: '2024-03-03', revenue: 1300, storeCount: 6 },
      { date: '2024-03-04', revenue: 1800, storeCount: 7 },
      { date: '2024-03-05', revenue: 1600, storeCount: 7 },
    ];
  },
    
  delete: (id) => fetchWithAuth(`${ENDPOINTS.STORES}/${id}`, {
    method: 'DELETE'
  })
};

// Add orderProductService
export const orderProductService = {
  getAll: () => fetchWithAuth(API_ENDPOINTS.ORDER_PRODUCTS),
  getById: (id) => fetchWithAuth(`${API_ENDPOINTS.ORDER_PRODUCTS}/${id}`),
  create: (orderProduct) => fetchWithAuth(API_ENDPOINTS.ORDER_PRODUCTS, {
    method: 'POST',
    body: JSON.stringify(orderProduct)
  }),
  update: (orderProduct) => fetchWithAuth(`${API_ENDPOINTS.ORDER_PRODUCTS}/${orderProduct.orderProductId}`, {
    method: 'PUT',
    body: JSON.stringify(orderProduct)
  }),
  delete: (id) => fetchWithAuth(`${API_ENDPOINTS.ORDER_PRODUCTS}/${id}`, {
    method: 'DELETE'
  })
}; 
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { orderService } from "../../services/api";
import "./Billing.css";

const BillingPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await orderService.getByStore(user?.storeId);
      // Filter out invalid products
      const validProducts = data?.filter(product => 
        product && 
        product.id && 
        product.name && 
        typeof product.price === 'number'
      ) || [];
      setProducts(validProducts);
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    try {
      await orderService.createOrder({
        items: cart,
        total: calculateTotal(),
        storeId: user.storeId,
      });
      setCart([]);
      // Show success message
    } catch (err) {
      console.error("Checkout failed:", err);
      // Show error message
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="billing-page">
      <div className="billing-header">
        <h1>Billing</h1>
        <div className="store-info">
          <i className="fas fa-store"></i>
          <span>Store ID: {user?.storeId}</span>
        </div>
      </div>

      <div className="billing-grid">
        <div className="products-section">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="products-grid">
            {products
              .filter((product) =>
                product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || ''
              )
              .map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-info">
                    <h3>{product?.name || 'Unnamed Product'}</h3>
                    <p className="price">${(product?.price || 0).toFixed(2)}</p>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    <i className="fas fa-plus"></i>
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className="cart-section">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <span className="item-count">{cart.length} items</span>
          </div>

          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              <i className="fas fa-shopping-cart"></i>
              Complete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;

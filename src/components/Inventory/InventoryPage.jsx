import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { productService, inventoryService } from "../../services/api";
import "./Inventory.css";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();

  const categories = [
    "all",
    "Fruits",
    "Vegetables",
    "Dairy",
    "Bakery",
    "Beverages",
    "Snacks",
    "Meat",
  ];

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inventoryData, productsData] = await Promise.all([
        inventoryService.getByStore(user?.storeId),
        productService.getAll(),
      ]);

      const mappedInventory = inventoryData.map((item) => ({
        ...item,
        name:
          item.name || productsData.find((p) => p.id === item.productId)?.name,
        brand:
          item.brand ||
          productsData.find((p) => p.id === item.productId)?.brand,
        category:
          item.category ||
          productsData.find((p) => p.id === item.productId)?.category,
      }));

      setInventory(mappedInventory);
      setAllProducts(productsData);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToInventory = async (product, quantity) => {
    try {
      await inventoryService.create({
        productId: product.id,
        storeId: user?.storeId,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        quantity: parseInt(quantity) || 0,
      });
      fetchData();
      setShowAddModal(false);
    } catch (err) {
      setError("Failed to add product to inventory");
      console.error(err);
    }
  };

  const filteredProducts = allProducts.filter((product) =>
    selectedCategory === "all" ? true : product.category === selectedCategory
  );

  if (loading) return <div className="loading">Loading inventory...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Inventory</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Add Item
        </button>
      </div>

      <div className="cards-grid">
        {inventory.map((item) => (
          <div key={item.id} className="card">
            <div className="card-header">
              <h3>{item.name}</h3>
              <span className="badge badge-success">{item.quantity} in stock</span>
            </div>
            <div className="card-content">
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>Last Updated:</strong> {new Date(item.updatedAt).toLocaleDateString()}</p>
            </div>
            <div className="card-actions">
              <button className="btn btn-secondary" onClick={() => handleEdit(item)}>
                <i className="fas fa-edit"></i> Update
              </button>
              <button className="btn btn-primary" onClick={() => handleView(item)}>
                <i className="fas fa-eye"></i> Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {showProductsModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Products by Category</h2>
            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <h3>{product.name}</h3>
                  <p>
                    <strong>Category:</strong> {product.category}
                  </p>
                  <p>
                    <strong>Brand:</strong> {product.brand}
                  </p>
                  <p>
                    <strong>Price:</strong> ${product.price.toFixed(2)}
                  </p>
                  <div className="add-controls">
                    <input
                      type="number"
                      min="1"
                      placeholder="Quantity"
                      onChange={(e) => (product.quantity = e.target.value)}
                    />
                    <button
                      onClick={() =>
                        handleAddToInventory(product, product.quantity)
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="close-btn"
              onClick={() => {
                setShowProductsModal(false);
                setSelectedCategory("all");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Products to Inventory</h2>
            <div className="products-grid">
              {allProducts
                .filter(
                  (product) =>
                    !inventory.find((item) => item.productId === product.id)
                )
                .map((product) => (
                  <div key={product.id} className="product-card">
                    <h3>{product.name}</h3>
                    <p>
                      <strong>Category:</strong> {product.category}
                    </p>
                    <p>
                      <strong>Brand:</strong> {product.brand}
                    </p>
                    <p>
                      <strong>Price:</strong> ${product.price.toFixed(2)}
                    </p>
                    <div className="add-controls">
                      <input
                        type="number"
                        min="1"
                        placeholder="Quantity"
                        onChange={(e) => (product.quantity = e.target.value)}
                      />
                      <button
                        onClick={() =>
                          handleAddToInventory(product, product.quantity)
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            <button
              className="close-btn"
              onClick={() => setShowAddModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <h2>Product Details</h2>
            <div className="product-details">
              <p>
                <strong>Product ID:</strong> {selectedProduct.productId}
              </p>
              <p>
                <strong>Name:</strong> {selectedProduct.name}
              </p>
              <p>
                <strong>Category:</strong> {selectedProduct.category}
              </p>
              <p>
                <strong>Brand:</strong> {selectedProduct.brand}
              </p>
              <p>
                <strong>Price:</strong> ${selectedProduct.price.toFixed(2)}
              </p>
              <p>
                <strong>Quantity:</strong> {selectedProduct.quantity}
              </p>
              <p>
                <strong>Status:</strong> {selectedProduct.status}
              </p>
            </div>
            <button
              className="close-btn"
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;

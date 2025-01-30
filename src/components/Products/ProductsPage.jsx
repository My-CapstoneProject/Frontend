import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { productService } from "../../services/api";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import "./Products.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const getCategories = () => {
    const categories = new Set(products.map((product) => product.category));
    return ["all", ...Array.from(categories)];
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      filters.category === "all" || product.category === filters.category;

    const matchesSearch =
      !filters.search ||
      (product.name &&
        product.name.toLowerCase().includes(filters.search.toLowerCase())) ||
      (product.brand &&
        product.brand.toLowerCase().includes(filters.search.toLowerCase())) ||
      (product.category &&
        product.category.toLowerCase().includes(filters.search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleAddProduct = async (productData) => {
    try {
      await productService.create(productData);
      fetchProducts();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await productService.update(productData);
      fetchProducts();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await productService.delete(productId);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleApproval = async (productId, status) => {
    try {
      await productService.update({
        productId,
        status,
      });
      fetchProducts();
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Add Product
        </button>
      </div>

      <div className="cards-grid">
        {products.map((product) => (
          <div key={product.id} className="card">
            <div className="card-header">
              <h3>{product.name}</h3>
              <span className="badge badge-success">{product.status}</span>
            </div>
            <div className="card-content">
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
            </div>
            <div className="card-actions">
              <button className="btn btn-secondary" onClick={() => handleEdit(product)}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button className="btn btn-primary" onClick={() => handleView(product)}>
                <i className="fas fa-eye"></i> View
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onProductAdded={fetchProducts}
        />
      )}

      {showEditModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setShowEditModal(false)}
          onProductUpdated={fetchProducts}
        />
      )}
    </div>
  );
};

export default ProductsPage;

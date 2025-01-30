// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../../contexts/AuthContext";
// import AddProductModal from "./AddProductModal";
// import EditProductModal from "./EditProductModal";
// import ViewProductModal from "./ViewProductModal"; // Import the ViewProductModal
// import "./Products.css";

// const ProductsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false); // State to manage the view modal
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchProducts();
//   }, []); // Runs once when the component mounts

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:8060/api/products");
//       setProducts(response.data); // Sets the fetched products from backend
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       setError("Failed to fetch products from the backend.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddProduct = async (productData) => {
//     try {
//       await axios.post("http://localhost:8060/api/products", productData);
//       fetchProducts(); // Refresh product list
//       setShowAddModal(false);
//     } catch (error) {
//       console.error("Error adding product:", error);
//     }
//   };

//   const handleUpdateProduct = async (productData) => {
//     try {
//       await axios.put(`http://localhost:8060/api/products/${productData.productId}`, productData);
//       fetchProducts(); // Refresh product list
//       setShowEditModal(false);
//     } catch (error) {
//       console.error("Error updating product:", error);
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     try {
//       await axios.delete(`http://localhost:8060/api/products/${productId}`);
//       fetchProducts(); // Refresh product list
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   const handleEdit = (product) => {
//     setSelectedProduct(product);
//     setShowEditModal(true);
//   };

//   const handleView = (product) => {
//     setSelectedProduct(product);
//     setShowViewModal(true); // Show the View modal
//   };

//   if (loading) return <div className="loading">Loading products...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="page-container">
//       <div className="page-header">
//         <h1>Products</h1>
//         <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
//           <i className="fas fa-plus"></i> Add Product
//         </button>
//       </div>

//       <div className="cards-grid">
//         {products.map((product) => (
//           <div key={product.productId} className="card">
//             <div className="card-header">
//               <h3>{product.productName}</h3>
//               <span className="badge badge-success">{product.productCategory}</span>
//             </div>
//             <div className="card-content">
//               <p><strong>Brand:</strong> {product.productBrand}</p>
//               <p><strong>Price:</strong> ${product.productPrice}</p>
//               <p><strong>Category:</strong> ${product.productCategory}</p>
//             </div>
//             <div className="card-actions">
//               <button className="btn btn-secondary" onClick={() => handleEdit(product)}>
//                 <i className="fas fa-edit"></i> Edit
//               </button>
//               <button className="btn btn-primary" onClick={() => handleView(product)}>
//                 <i className="fas fa-eye"></i> View
//               </button>
//               <button className="btn btn-danger" onClick={() => handleDeleteProduct(product.productId)}>
//                 <i className="fas fa-trash"></i> Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showAddModal && (
//         <AddProductModal
//           onClose={() => setShowAddModal(false)}
//           onProductAdded={fetchProducts}
//         />
//       )}

//       {showEditModal && selectedProduct && (
//         <EditProductModal
//           product={selectedProduct}
//           onClose={() => setShowEditModal(false)}
//           onProductUpdated={fetchProducts}
//         />
//       )}

//       {showViewModal && selectedProduct && (
//         <ViewProductModal
//           product={selectedProduct}
//           onClose={() => setShowViewModal(false)} // Close the modal
//         />
//       )}
//     </div>
//   );
// };

// export default ProductsPage;

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import ViewProductModal from "./ViewProductModal"; // Import the ViewProductModal
import "./Products.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // State to manage the view modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []); // Runs once when the component mounts

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8060/api/products");
      setProducts(response.data); // Sets the fetched products from backend
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products from the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      await axios.post("http://localhost:8060/api/products", productData);
      fetchProducts(); // Refresh product list
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await axios.put(`http://localhost:8060/api/products/${productData.productId}`, productData);
      fetchProducts(); // Refresh product list
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:8060/api/products/${productId}`);
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true); // Show the View modal
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
          <div key={product.productId} className="card">
            <div className="card-image">
              <img src={product.productImageUrl} alt={product.productName} className="product-image" />
            </div>

            <div className="card-content">
              <div className="detail-group">
                <strong>Category:</strong>
                <p>{product.productCategory}</p>
              </div>
              <div className="detail-group">
                <strong>Name:</strong>
                <p>{product.productName}</p>
              </div>
              <div className="detail-group">
                <strong>Brand:</strong>
                <p>{product.productBrand}</p>
              </div>
              <div className="detail-group">
                <strong>Price:</strong>
                <p>${product.productPrice}</p>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn btn-secondary" onClick={() => handleEdit(product)}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button className="btn btn-primary" onClick={() => handleView(product)}>
                <i className="fas fa-eye"></i> View
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteProduct(product.productId)}>
                <i className="fas fa-trash"></i> Delete
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

      {showViewModal && selectedProduct && (
        <ViewProductModal
          product={selectedProduct}
          onClose={() => setShowViewModal(false)} // Close the modal
        />
      )}
    </div>
  );
};

export default ProductsPage;

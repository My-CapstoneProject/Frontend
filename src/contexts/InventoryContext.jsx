import { createContext, useState } from "react";
import { inventoryService } from "../services/api";

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInventory = async (storeId) => {
    setLoading(true);
    try {
      const data = await inventoryService.getByStore(storeId);
      setInventory(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch inventory");
      console.error("Fetch inventory error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateInventoryQuantity = async (id, quantity) => {
    try {
      const updatedItem = await inventoryService.updateQuantity(id, quantity);
      setInventory((prev) =>
        prev.map((item) => (item.inventoryId === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (err) {
      setError(err.message || "Failed to update quantity");
      throw err;
    }
  };

  const addToInventory = async (item) => {
    try {
      const newItem = await inventoryService.create(item);
      setInventory((prev) => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message || "Failed to add item to inventory");
      throw err;
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        loading,
        error,
        fetchInventory,
        updateInventoryQuantity,
        addToInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../../Context/StoreContext";
import "./Recipe.css";

const Recipe = () => {
  const { apiUrl } = useContext(StoreContext);
  const [store, setStore] = useState([]);
  const [products, setProducts] = useState([]);

  const uomValues = [
    { id: 1, value: 'grams' },
    { id: 2, value: 'pieces' },
    { id: 3, value: 'wings' },
    { id: 4, value: 'spoons' },
    { id: 5, value: 'scopes' },
  ]

  const [data, setData] = useState({
    product_id: "",
    store_id: "",
    usage_amount: "",
    uom: "", // Default value for UOM
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const fetchProductItems = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/items`);
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("Failed to fetch product items.");
    }
  };

  const fetchStoreItems = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/store_items`);
      if (response.data.success) {
        setStore(response.data.data);
        console.log("store", store);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("Failed to fetch store items.");
    }
  };

  useEffect(() => {
    fetchProductItems();
    fetchStoreItems();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Prepare a JSON object instead of FormData
    const payload = {
      product_id: Number(data.product_id),
      store_id: Number(data.store_id),
      usage_amount: Number(data.usage_amount),
      uom: data.uom,
    };
    try {
      const response = await axios.post(`${apiUrl}/api/add_recipe`, payload);
      if (response.data.success) {
        setData({
          product_id: "",
          store_id: "",
          usage_amount: "",
          uom: "",
        });
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to create recipe item.");
    }
  };

  return (
    <div className="recipe content-page">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="recipe-row">
          <div className="recipe-col flex-col">
            <p>Menu Item</p>
            <select
              onChange={onChangeHandler}
              value={data.product_id || ""}
              name="product_id"
              required
            >
              <option value="" disabled>
                Select Product
              </option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.item_name}
                </option>
              ))}
            </select>
          </div>

          <div className="recipe-col flex-col">
            <p>Recipe Item</p>
            <select
              onChange={onChangeHandler}
              value={data.store_id || ""}
              name="store_id"
              required
            >
              <option value="" disabled>
                Select Store Item
              </option>

              {store.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="recipe-row">
          <div className="recipe-col flex-col">
            <p>UOM</p>
            <select
              onChange={onChangeHandler}
              value={data.uom || ""}
              name="uom"
              required
            >
              <option value="" disabled>
                Select Appropriate UOM
              </option>

              {uomValues.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>
          <div className="recipe-col flex-col">
            <p>Usage Amount ({data.uom || ""})</p>
            <input
            required
              onChange={onChangeHandler}
              value={data.usage_amount}
              type="number"
              name="usage_amount"
              placeholder="e.g. 100"
            />
          </div>
        
        </div>

        <button type="submit" className="item-btn">
          Create Recipe Item
        </button>
      </form>
    </div>
  );
};

export default Recipe;

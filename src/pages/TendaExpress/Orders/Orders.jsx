import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Orders.css";
import { StoreContext } from "../../../Context/StoreContext";
import { assets } from "../../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = React.useState([]);
  const { apiUrl, setToken } = React.useContext(StoreContext);

  const fetchAllOrders = async () => {
    const response = await axios.get(`${apiUrl}/api/orders`);
    console.log(response.data.data);
    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      toast.error("Error fetching orders");
    }
  };

  React.useEffect(() => {
    fetchAllOrders();
  }, []);


  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${apiUrl}/api/status`, {
      id: orderId,
      order_status: event.target.value,
    });
    console.log(orderId, (event.target.value))
    if (response.data.success) {
      await fetchAllOrders();
    }
  };

 
  return (
    <div className="content-page order">
      {/* ////// */}
      <div className="order-list">
        
        {orders.map((order, index) => {
          let items = [];
          try {
            items = JSON.parse(order.order_items);
          } catch (error) {
            console.error("Error parsing order_items:", error);
          }
          console.log("Parsed items:", items);
          if (!Array.isArray(items)) {
            return (
              <div key={order.id} className="order-item">
                Error: Invalid order items
              </div>
            );
          }
          return (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="" />

              <div>
                <p className="order-item-food">
                  {items
                    .map((item) => `${item.item_name} x ${item.quantity || 1}`)
                    .join(", ")}
                </p>
                <p className="order-item-name">
                    {order.username}
                </p>
                <div className="order-item-address">
                  <p>Address</p>
                  <p>
                  {order.delivery_latitude +
                    ", " +
                    order.delivery_longitude}
                </p>
                </div>
                <p className="order-item-phone">{order.mobile}</p>
              </div>
              <p>Items: {items.length}</p>
            <p>Shs.{order.order_total  }</p>
            <select onChange={(event) => statusHandler(event, order.id)} value={order.order_status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;

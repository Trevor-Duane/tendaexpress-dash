import React, { useEffect, useState } from "react";
import { StoreContext } from "../../../Context/StoreContext";
import { ToastContainer } from "react-toastify";
import SalesLineChart from "../../../components/Graphs/SalesLineChart";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";
import { assets } from "../../../assets/assets";
import SalesBarChart from "../../../components/Graphs/SalesBarChart";

const Dashboard = () => {

  const { apiUrl } = React.useContext(StoreContext);

  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topSelling, setTopSelling] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, revenueRes, topSellingRes, ordersRes] = await Promise.all([
          fetch(`${apiUrl}/api/daily_sales`).then(res => res.json()),
          fetch(`${apiUrl}/api/total_revenue`).then(res => res.json()),
          fetch(`${apiUrl}/api/top_selling`).then(res => res.json()),
          fetch(`${apiUrl}/api/total_orders`).then(res => res.json())
        ]);

        console.log("top orders", topSellingRes)

        setSalesData(salesRes);
        setTotalRevenue(revenueRes.total_revenue);
        setTopSelling(topSellingRes);
        setTotalOrders(ordersRes?.data?.length || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="content-page dashboard">
      <div className="dashboard-header">
        <h4 className="dashboard-head">Simple is better</h4>
        <p className="dashboard-date">{formattedDate}</p>
      </div>
      <section>
        <div className="top-row">
          <div className="left-column grid-column">
            <div className="inner-grid-column">
              <p className="normal-para">Orders</p>
              <p className="bold-para">{totalOrders}</p>
            </div>
            <div className="inner-grid-column">
              <p className="normal-para">Revenue</p>
              <p className="bold-para">{totalRevenue.toLocaleString()} /=</p>
            </div>
            <div className="inner-grid-column">
              <p className="normal-para">Dine In</p>
              <p className="bold-para">14</p>
            </div>
            <div className="inner-grid-column">
              <p className="normal-para">Take Away</p>
              <p className="bold-para">15</p>
            </div>
          </div>
          <div className="middle-column grid-column">
            <div>
              <h4 className="bold-para">Sales Line Graph</h4>
            </div>
            <div>
              <SalesLineChart data={salesData} />
            </div>
          </div>
          <div className="right-column grid-column">
            <div className="pie">
              <h4 className="bold-para">Sales Bars</h4>
            </div>
            <div>
              <SalesBarChart data={salesData} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="current-orders">
          <div className="current-orders-header">
            <h4 className="bold-para">Current Orders</h4>
            <p>Sort by Newest</p>
          </div>

          {topSelling?.map((item, index) => (
            <div className="current-order-container" key={item.id || index}>
              <div className="flex-container-1">
                <div>
                  <img src={assets.dish} height="60px" width="60px" alt="" />
                </div>
                <div>
                  <p>Order #63563356</p>
                  <p>{formattedDate}</p>
                </div>
              </div>
              <div className="flex-container-2">
                <div>
                  <p>{item.item_name}</p>
                  <p>Total Sales: Shs. {item.total_sales.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}


          {/* <div className="current-order-container">
            <div className="flex-container-1">
              <div>
                <img
                  src={assets.dish}
                  height="60px"
                  width="60px"
                  alt=""
                />
              </div>
              <div>
                <p>Order #63563356</p>
                <p>{formattedDate}</p>
              </div>
            </div>
            <div className="flex-container-2">
              <div>
                <p>John Doe</p>
                <p>Total Amount: Shs.43000</p>
              </div>
            </div>
            <div className="flex-container-3">
              <div>
                <span className="flex-container-span">
                  <p>Pending</p>
                  <img src={assets.pending} alt="" height={18} width={18} />
                </span>
                <p>visa</p>
              </div>
            </div>
            <div className="flex-container-4">
              <button>Order Status</button>
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

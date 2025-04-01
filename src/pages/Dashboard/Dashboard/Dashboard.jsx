import React, { useEffect, useState } from "react";
import { StoreContext } from "../../../Context/StoreContext";
import { ToastContainer } from "react-toastify";
import SalesLineChart from "../../../components/Graphs/SalesLineChart";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";
import { assets } from "../../../assets/assets";
import SalesBarChart from "../../../components/Graphs/SalesBarChart";
import StockTable from "../../../components/Tables/StockTable";
import Table from "../../../components/Tables/Table";

const Dashboard = () => {

  const { apiUrl } = React.useContext(StoreContext);

  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topSelling, setTopSelling] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, revenueRes, topSellingRes, ordersRes, stockLevels] = await Promise.all([
          fetch(`${apiUrl}/api/daily_sales`).then(res => res.json()),
          fetch(`${apiUrl}/api/total_revenue`).then(res => res.json()),
          fetch(`${apiUrl}/api/top_selling`).then(res => res.json()),
          fetch(`${apiUrl}/api/total_orders`).then(res => res.json()),
          fetch(`https://api.tendaafrica.net/api/stock_levels`).then(res => res.json())
        ]);

        console.log("top orders", topSellingRes)
        console.log("top orders", topSellingRes)
        console.log("daily sales", salesRes)

        setSalesData(salesRes);
        setStockItems(stockLevels.data)
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
      {/* <div className="dashboard-header">
        <h4 className="dashboard-head">Simple is better</h4>
        <p className="dashboard-date">{formattedDate}</p>
      </div> */}
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

      <section className="stock-levels-section">
        <h4 className="bold-para">Stock Levels</h4>
        <div className="stock-levels">
          {(stockItems.filter(item => item.max_portions !== null && item.max_portions !== undefined)).map((item, index) => (
            <div key={index} className="stock-level-item">
              <p className="card-title"><strong>{item.item_name}</strong></p>
              <p>{item.max_portions ?? "cant be prepared"} Preparations</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="current-orders">
          <div className="current-orders-header">
            <h4 className="bold-para">Top Selling</h4>
          </div>

          {topSelling?.map((item, index) => (
            <div className="current-order-container" key={item.id || index}>
              <div className="flex-container-2">
                <div>
                  <p>{item.item_name}</p>
                  <p>Total Sales: Shs. {item.total_sales.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

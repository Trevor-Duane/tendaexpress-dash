import React, { useState, useEffect } from "react";
import "./ExpandableMenuItemRow.css";

const ExpandableMenuItemRow = ({ data, loading }) => {
  const [profitProjections, setProfitProjections] = useState({});

  const getProfitProjection = async ({ ais, ps, pp }) => {
    const inStockUnits = Math.floor(ais / ps);
    return <>{Intl.NumberFormat("en-US").format(inStockUnits * pp)}/=</>;
  };

  useEffect(() => {
    const calculateProjections = async () => {
      let projections = {};
      for (let item of data) {
        const projection = await getProfitProjection({
          ais: item.store.amount_in_store,
          ps: item.usage_amount,
          pp: item.item.item_price,
        });
        projections[item.id] = projection; // Store the result using item id
      }
      setProfitProjections(projections);
    };

    if (data && data.length > 0) {
      calculateProjections();
    }
  }, [data]);

  return (
    <div style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
      <div className="recipe-card-header">
        <h3>Recipe Card</h3>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : data && data.length > 0 ? (
        <ul className="recipe-card-list">
          {data.map((item) => (
            <li key={item.id}>
              <strong>Recipe Item: </strong> {item.store.item_name} <br></br>
              <strong>Portion Size: </strong> {item.usage_amount}g <br></br>
              <strong>Amount in Store: </strong> {item.store.amount_in_store}g{" "}
              <br></br>
              <strong>Profit Projection: </strong>{" "}
              {profitProjections[item.id] !== undefined
                ? profitProjections[item.id]
                : "Calculating..."}
              <div className="spacing-div"></div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipe data available.</p>
      )}
    </div>
  );
};

export default ExpandableMenuItemRow;

import React from "react";

const StockTable = ({ items }) => {
  // Filter items into two categories
  const canPrepare = items.filter(item => item.max_portions !== null);
  const cannotPrepare = items.filter(item => item.max_portions === 0);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Items That Can Be Prepared</h2>
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Item Name</th>
            <th className="border p-2">Max Portions</th>
          </tr>
        </thead>
        <tbody>
          {canPrepare.map((item, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{item.item_name}</td>
              <td className="border p-2">{item.max_portions}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mb-2">Items That Cannot Be Prepared</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Item Name</th>
          </tr>
        </thead>
        <tbody>
          {cannotPrepare.map((item, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{item.item_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;

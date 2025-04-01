import { useState } from "react";

const Table = ({ data, columns, pageSize = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full block bg-[#993366] text-white p-6 rounded-lg shadow-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#802B57]">
            {columns.map((col, index) => (
              <th key={index} className="px-4 py-3 text-left border-b border-white uppercase tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? "bg-[#A0466B]" : "bg-[#993366]"} hover:bg-[#b3547e] transition`}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-3 border-b border-white">
                  {col.accessor ? row[col.accessor] : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 bg-white text-[#993366] rounded-lg shadow-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e6d5e2]"} `}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-white font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 bg-white text-[#993366] rounded-lg shadow-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e6d5e2]"} `}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;

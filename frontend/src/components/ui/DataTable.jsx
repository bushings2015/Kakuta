import React from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

export const DataTable = ({
  columns,
  data,
  totalItems,
  loading,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  selectedIds,
  setSelectedIds,
  onDeleteSelected,
  renderActions,
  title = "Table",
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const toggleSelectAll = () => {
    const pageIds = data.map((item) => item.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {/* Controls: Page Size & Bulk Actions */}
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center gap-2">
          <label className="text-gray-700 text-sm">Rows per page:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {selectedIds?.length > 0 && onDeleteSelected && (
          <button
            onClick={onDeleteSelected}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm"
          >
            <Trash2 className="w-4 h-4" /> Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          {setSelectedIds && (
            <input
              type="checkbox"
              checked={data.length > 0 && data.every((item) => selectedIds.includes(item.id))}
              onChange={toggleSelectAll}
            />
          )}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No data found</div>
        ) : (
          <table className="w-full table-auto text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {setSelectedIds && (
                  <th className="w-1/12 px-6 py-3 border-b text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th key={idx} className={`${col.className || ''} px-6 py-3 border-b text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {col.label}
                  </th>
                ))}
                {renderActions && (
                  <th className="px-6 py-3 border-b text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, idx) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {setSelectedIds && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleSelect(row.id)}
                      />
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-sm text-gray-700">
                      {col.render ? col.render(row, idx) : row[col.key]}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-6 py-4 flex gap-2">
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 p-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-1 text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 text-sm rounded-lg ${
                currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-1 text-sm"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
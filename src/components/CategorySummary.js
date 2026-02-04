import React, { useState, useEffect } from 'react';
import { getCategorySummary } from '../services/transactionService';
import { FaChartPie } from 'react-icons/fa';
import { formatCurrency } from '../utils/currency';

const CategorySummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    division: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchSummary();
  }, [filters]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await getCategorySummary(filters);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching category summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = summary.reduce((sum, item) => sum + item.totalAmount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">Category Summary</h1>
          <p className="text-sm text-gray-500">Analyze your spending by category</p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Division
              </label>
              <select
                name="division"
                value={filters.division}
                onChange={(e) => setFilters({ ...filters, division: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">All</option>
                <option value="Personal">Personal</option>
                <option value="Office">Office</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaChartPie className="text-gray-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Category Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Division
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {summary.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <FaChartPie className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">No data found</p>
                        <p className="text-sm text-gray-500">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  summary.map((item, index) => {
                    const percentage = totalAmount > 0 ? (item.totalAmount / totalAmount) * 100 : 0;
                    return (
                      <tr 
                        key={index} 
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{item._id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              item.type === 'income'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            item.division === 'Office' 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'bg-purple-50 text-purple-700'
                          }`}>
                            {item.division}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-semibold ${
                            item.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(item.totalAmount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{item.count}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                              <div
                                className={`h-2 rounded-full ${
                                  item.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600 w-12 text-right">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySummary;

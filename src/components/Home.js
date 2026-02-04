import React, { useState, useEffect } from 'react';
import { getTransactions, deleteTransaction } from '../services/transactionService';
import TransactionModal from './TransactionModal';
import { FaPlus, FaEdit, FaTrash, FaFilter, FaTimes } from 'react-icons/fa';
import { formatCurrency } from '../utils/currency';

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    division: '',
    category: '',
    startDate: '',
    endDate: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'Fuel', 'Movie', 'Food', 'Loan', 'Medical', 'Shopping',
    'Entertainment', 'Transport', 'Bills', 'Salary', 'Bonus', 'Other'
  ];

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactions(filters);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction) => {
    const createdAt = new Date(transaction.createdAt);
    const now = new Date();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);

    if (hoursDiff > 12) {
      alert('Cannot edit transaction after 12 hours');
      return;
    }

    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now - created) / (1000 * 60 * 60);

    if (hoursDiff > 12) {
      alert('Cannot delete transaction after 12 hours');
      return;
    }

    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        fetchTransactions();
      } catch (error) {
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert('Failed to delete transaction');
        }
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      division: '',
      category: '',
      startDate: '',
      endDate: '',
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canEdit = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now - created) / (1000 * 60 * 60);
    return hoursDiff <= 12;
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-1">Transactions</h1>
              <p className="text-sm text-gray-500">Manage your income and expenses</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FaFilter className="mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-white text-gray-900 px-1.5 py-0.5 rounded text-xs font-semibold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white border border-transparent rounded-lg text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Transaction
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Filter Transactions</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Type
                </label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
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
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="">All</option>
                  <option value="Personal">Personal</option>
                  <option value="Office">Office</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="">All</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
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
                  onChange={handleFilterChange}
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
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Transactions Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm">Loading transactions...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Division
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">No transactions found</p>
                          <p className="text-sm text-gray-500">Try adjusting your filters or add a new transaction</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => {
                      const editable = canEdit(transaction.createdAt);
                      return (
                        <tr 
                          key={transaction._id} 
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                transaction.type === 'income'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {transaction.type === 'income' ? 'Income' : 'Expense'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-semibold ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{transaction.description}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{transaction.category}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              transaction.division === 'Office' 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'bg-purple-50 text-purple-700'
                            }`}>
                              {transaction.division}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(transaction)}
                                disabled={!editable}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  !editable 
                                    ? 'text-gray-300 cursor-not-allowed' 
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                                title={!editable ? 'Cannot edit after 12 hours' : 'Edit'}
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(transaction._id, transaction.createdAt)}
                                disabled={!editable}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  !editable 
                                    ? 'text-gray-300 cursor-not-allowed' 
                                    : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                }`}
                                title={!editable ? 'Cannot delete after 12 hours' : 'Delete'}
                              >
                                <FaTrash />
                              </button>
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
        )}

        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
          transaction={editingTransaction}
          onSuccess={fetchTransactions}
        />
      </div>
    </div>
  );
};

export default Home;

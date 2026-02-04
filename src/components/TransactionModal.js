import React, { useState, useEffect } from 'react';
import { createTransaction, updateTransaction } from '../services/transactionService';
import { FaTimes } from 'react-icons/fa';

const TransactionModal = ({ isOpen, onClose, transaction = null, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('income');
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: '',
    division: 'Personal',
    account: 'Main Account',
    date: new Date().toISOString().slice(0, 16),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Fuel', 'Movie', 'Food', 'Loan', 'Medical', 'Shopping',
    'Entertainment', 'Transport', 'Bills', 'Salary', 'Bonus', 'Other'
  ];

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
        division: transaction.division,
        account: transaction.account || 'Main Account',
        date: new Date(transaction.date).toISOString().slice(0, 16),
      });
      setActiveTab(transaction.type);
    } else {
      resetForm();
    }
  }, [transaction, isOpen]);

  const resetForm = () => {
    setFormData({
      type: 'income',
      amount: '',
      description: '',
      category: '',
      division: 'Personal',
      account: 'Main Account',
      date: new Date().toISOString().slice(0, 16),
    });
    setActiveTab('income');
    setError('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ ...formData, type: tab });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.amount || !formData.description || !formData.category) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
      };

      if (transaction) {
        await updateTransaction(transaction._id, submitData);
      } else {
        await createTransaction(submitData);
      }

      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to save transaction'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex border border-gray-200 rounded-lg mb-6 overflow-hidden">
            <button
              type="button"
              onClick={() => handleTabChange('income')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'income'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('expense')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'expense'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Expense
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Amount (₹) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Enter description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Division *
              </label>
              <select
                name="division"
                value={formData.division}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="Personal">Personal</option>
                <option value="Office">Office</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Account
              </label>
              <input
                type="text"
                name="account"
                value={formData.account}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Main Account"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : transaction ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;

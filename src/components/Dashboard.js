import React, { useState, useEffect } from 'react';
import { getDashboardStats, getTransactions } from '../services/transactionService';
import { FaArrowUp, FaArrowDown, FaWallet, FaCalendarAlt } from 'react-icons/fa';
import { formatCurrency } from '../utils/currency';

const Dashboard = () => {
  const [period, setPeriod] = useState('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [period, startDate, endDate, useCustomDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      let periodParam = undefined;
      let startDateParam = undefined;
      let endDateParam = undefined;
      
      if (useCustomDate && startDate && endDate) {
        startDateParam = startDate;
        endDateParam = endDate;
      } else if (period) {
        periodParam = period;
      }

      const historyParams = { limit: 10 };
      if (useCustomDate && startDate && endDate) {
        historyParams.startDate = startDate;
        historyParams.endDate = endDate;
      }

      const [statsRes, historyRes] = await Promise.all([
        getDashboardStats(periodParam, startDateParam, endDateParam),
        getTransactions(historyParams),
      ]);
      setStats(statsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (value) => {
    setPeriod(value);
    setUseCustomDate(false);
    setStartDate('');
    setEndDate('');
  };

  const clearDateFilter = () => {
    setUseCustomDate(false);
    setStartDate('');
    setEndDate('');
    setPeriod('week');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-1">Dashboard</h1>
              <p className="text-sm text-gray-500">Financial overview and insights</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Filter by Period</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Period Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Quick Period
              </label>
              <div className="relative">
                <select
                  value={useCustomDate ? '' : period}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  disabled={useCustomDate}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Custom Date Range */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Custom Date Range
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setUseCustomDate(true);
                    setPeriod('');
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Start Date"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setUseCustomDate(true);
                    setPeriod('');
                  }}
                  min={startDate}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="End Date"
                />
                {(useCustomDate && (startDate || endDate)) && (
                  <button
                    onClick={clearDateFilter}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Clear date filter"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
          {useCustomDate && startDate && endDate && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Showing data from <span className="font-medium">{new Date(startDate).toLocaleDateString()}</span> to <span className="font-medium">{new Date(endDate).toLocaleDateString()}</span>
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Income Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Income</p>
                <p className="text-2xl font-semibold text-gray-900 mb-2">
                  {formatCurrency(stats.income)}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <FaArrowUp className="text-green-500 mr-1" />
                  <span>Income received</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <FaArrowUp className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Expense</p>
                <p className="text-2xl font-semibold text-gray-900 mb-2">
                  {formatCurrency(stats.expense)}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <FaArrowDown className="text-red-500 mr-1" />
                  <span>Expenses paid</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <FaArrowDown className="text-red-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className={`bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow ${
            stats.balance >= 0 ? 'border-gray-200' : 'border-orange-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Balance</p>
                <p className={`text-2xl font-semibold mb-2 ${
                  stats.balance >= 0 ? 'text-gray-900' : 'text-orange-600'
                }`}>
                  {formatCurrency(stats.balance)}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <FaWallet className={`mr-1 ${stats.balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`} />
                  <span>{stats.balance >= 0 ? 'Positive balance' : 'Negative balance'}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stats.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'
              }`}>
                <FaWallet className={`text-xl ${stats.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
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
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Division
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">No transactions</p>
                        <p className="text-sm text-gray-500">Get started by adding your first transaction</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.map((transaction) => (
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

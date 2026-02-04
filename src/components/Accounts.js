import React, { useState, useEffect } from 'react';
import {
  getAccounts,
  createAccount,
  getAccountTransactions,
  transferBetweenAccounts,
  getAllTransfers,
} from '../services/accountService';
import { FaPlus, FaExchangeAlt, FaWallet, FaTimes } from 'react-icons/fa';
import { formatCurrency } from '../utils/currency';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', balance: 0 });
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
    fetchTransfers();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchAccountTransactions();
    }
  }, [selectedAccount]);

  const fetchAccounts = async () => {
    try {
      const response = await getAccounts();
      setAccounts(response.data);
      if (response.data.length > 0 && !selectedAccount) {
        setSelectedAccount(response.data[0].name);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountTransactions = async () => {
    try {
      const response = await getAccountTransactions(selectedAccount);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching account transactions:', error);
    }
  };

  const fetchTransfers = async () => {
    try {
      const response = await getAllTransfers();
      setTransfers(response.data);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createAccount(newAccount);
      setNewAccount({ name: '', balance: 0 });
      setShowAddAccount(false);
      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await transferBetweenAccounts(transferData);
      setTransferData({ fromAccount: '', toAccount: '', amount: '', description: '' });
      setShowTransfer(false);
      fetchAccounts();
      fetchTransfers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to transfer');
    }
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
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading accounts...</p>
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
              <h1 className="text-3xl font-semibold text-gray-900 mb-1">Accounts</h1>
              <p className="text-sm text-gray-500">Manage your accounts and transfers</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTransfer(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                <FaExchangeAlt className="mr-2" />
                Transfer
              </button>
              <button
                onClick={() => setShowAddAccount(true)}
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white border border-transparent rounded-lg text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Account
              </button>
            </div>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {accounts.map((account) => (
            <div
              key={account._id}
              onClick={() => setSelectedAccount(account.name)}
              className={`bg-white rounded-xl border p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedAccount === account.name
                  ? 'border-gray-900 ring-2 ring-gray-900'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FaWallet className="text-gray-600" />
                </div>
                {selectedAccount === account.name && (
                  <span className="text-xs font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    Selected
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{account.name}</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(account.balance)}
              </p>
            </div>
          ))}
        </div>

        {/* Account Transactions */}
        {selectedAccount && (
          <div className="mb-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Transactions for {selectedAccount}
              </h2>
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
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaWallet className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">No transactions</p>
                          <p className="text-sm text-gray-500">This account has no transactions yet</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
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
        )}

        {/* Transfer History */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Transfer History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transfers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <FaExchangeAlt className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">No transfers</p>
                        <p className="text-sm text-gray-500">Transfer history will appear here</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transfers.map((transfer) => (
                    <tr key={transfer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{transfer.fromAccount}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{transfer.toAccount}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(transfer.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{transfer.description}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transfer.date)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Account Modal */}
        {showAddAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Add New Account</h2>
                <button
                  onClick={() => {
                    setShowAddAccount(false);
                    setError('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleAddAccount} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Initial Balance
                  </label>
                  <input
                    type="number"
                    value={newAccount.balance}
                    onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) || 0 })}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAccount(false);
                      setError('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                  >
                    Add Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transfer Modal */}
        {showTransfer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Transfer Between Accounts</h2>
                <button
                  onClick={() => {
                    setShowTransfer(false);
                    setError('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleTransfer} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    From Account *
                  </label>
                  <select
                    value={transferData.fromAccount}
                    onChange={(e) => setTransferData({ ...transferData, fromAccount: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((acc) => (
                      <option key={acc._id} value={acc.name}>
                        {acc.name} ({formatCurrency(acc.balance)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    To Account *
                  </label>
                  <select
                    value={transferData.toAccount}
                    onChange={(e) => setTransferData({ ...transferData, toAccount: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((acc) => (
                      <option key={acc._id} value={acc.name}>
                        {acc.name} ({formatCurrency(acc.balance)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={transferData.amount}
                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                    step="0.01"
                    min="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <input
                    type="text"
                    value={transferData.description}
                    onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTransfer(false);
                      setError('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                  >
                    Transfer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;

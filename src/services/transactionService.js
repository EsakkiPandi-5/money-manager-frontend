import api from '../config/api';

export const getTransactions = (filters = {}) => {
  return api.get('/transactions', { params: filters });
};

export const getTransaction = (id) => {
  return api.get(`/transactions/${id}`);
};

export const createTransaction = (data) => {
  return api.post('/transactions', data);
};

export const updateTransaction = (id, data) => {
  return api.put(`/transactions/${id}`, data);
};

export const deleteTransaction = (id) => {
  return api.delete(`/transactions/${id}`);
};

export const getCategorySummary = (filters = {}) => {
  return api.get('/transactions/summary/categories', { params: filters });
};

export const getDashboardStats = (period, startDate, endDate) => {
  return api.get('/transactions/dashboard/stats', {
    params: { period, startDate, endDate },
  });
};


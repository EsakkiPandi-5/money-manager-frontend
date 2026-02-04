import api from '../config/api';

export const getAccounts = () => {
  return api.get('/accounts');
};

export const createAccount = (data) => {
  return api.post('/accounts', data);
};

export const getAccountTransactions = (accountName) => {
  return api.get(`/accounts/${accountName}/transactions`);
};

export const transferBetweenAccounts = (data) => {
  return api.post('/accounts/transfer', data);
};

export const getAllTransfers = () => {
  return api.get('/accounts/transfers/all');
};


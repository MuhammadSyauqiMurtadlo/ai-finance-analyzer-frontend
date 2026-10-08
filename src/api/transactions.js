import api from "./client";

export const getTransactions = () =>
  api.get("/transactions").then((res) => res.data.data);

export const createTransaction = (payload) =>
  api.post("/transactions", payload).then((res) => res.data.data);

export const updateTransaction = (id, payload) =>
  api.put(`/transactions/${id}`, payload).then((res) => res.data.data);

export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

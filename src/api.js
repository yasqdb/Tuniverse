import axios from "axios";

const API_URL = "http://localhost:4000/api";

export const BASE_URL = "http://localhost:4000/api";

const token = () => localStorage.getItem("token");

export const signup = (data) => axios.post(`${API_URL}/auth/signup`, data);

export const login = (data) => axios.post(`${API_URL}/auth/login`, data);

export const createOrder = (data) =>
  axios.post(`${API_URL}/orders/create`, data, {
    headers: { Authorization: `Bearer ${token()}` },
  });

export const getBuyerOrders = () =>
  axios.get(`${API_URL}/orders/buyer/${localStorage.getItem("userId")}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });

export const getSellerPendingOrders = () =>
  axios.get(
    `${API_URL}/orders/seller/pending/${localStorage.getItem("userId")}`,
    {
      headers: { Authorization: `Bearer ${token()}` },
    },
  );

export const acceptOrder = (orderId) =>
  axios.put(
    `${API_URL}/orders/accept/${orderId}/${localStorage.getItem("userId")}`,
    {},
    {
      headers: { Authorization: `Bearer ${token()}` },
    },
  );

export const rejectOrder = (orderId) =>
  axios.put(
    `${API_URL}/orders/reject/${orderId}/${localStorage.getItem("userId")}`,
    {},
    {
      headers: { Authorization: `Bearer ${token()}` },
    },
  );

export const getConversation = (orderId) =>
  axios.get(`${API_URL}/conversations/${orderId}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });

export const sendMessage = (conversationId, text) =>
  axios.post(
    `${API_URL}/conversations/send`,
    { conversationId, text },
    {
      headers: { Authorization: `Bearer ${token()}` },
    },
  );

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Normalisasi error: selalu kembalikan { message, errors } supaya
// komponen UI tidak perlu parsing struktur error Axios berulang kali.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    let message = "Terjadi kesalahan. Silakan coba lagi.";
    if (!error.response) {
      message = "Tidak dapat terhubung ke server. Pastikan backend berjalan.";
    } else if (status === 422) {
      message = data?.message || "Data yang dikirim tidak valid.";
    } else if (data?.message) {
      message = data.message;
    }

    return Promise.reject({
      status,
      message,
      errors: data?.errors || {}, // format validasi Laravel: { field: [pesan] }
    });
  },
);

export default api;

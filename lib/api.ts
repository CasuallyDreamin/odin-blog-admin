import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function checkApiHealth() {
  try {
    const start = Date.now();
    await api.get('/'); 
    const end = Date.now();
    return { 
      online: true, 
      latency: end - start 
    };
  } catch (err) {
    return { 
      online: false, 
      latency: 0 
    };
  }
}

export default api;
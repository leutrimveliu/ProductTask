import axios from "axios";

const addProduct = async (form) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  const res = await axios.post(`http://localhost:4000/products`, form);
  return res.data;
};
const getProducts = async () => {
  const res = await axios.get(`http://localhost:4000/products`);
  return res.data;
};

export { addProduct, getProducts };

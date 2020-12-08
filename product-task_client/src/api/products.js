import axios from "axios";

const addProduct = async (form) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  const res = await axios.post(`http://localhost:4000/products`, form);
  return res.data;
};
const getProducts = async () => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  const res = await axios.get(`http://localhost:4000/products`);
  return res.data;
};

const deleteProducts = async (id, user_id) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  await axios({
    method: "delete",
    url: `http://localhost:4000/products/${id}`,
    data: user_id,
  })
    .then(function (response) {})
    .catch(function (response) {
      console.log(response);
    });
};
const editProduct = async (form, id) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  await axios({
    method: "put",
    url: `http://localhost:4000/products/${id}`,
    data: form,
  })
    .then(function (response) {})
    .catch(function (response) {
      console.log(response);
    });
};
const getProduct = async (id) => {
  const res = await axios.get(`http://localhost:4000/products/${id}`);
  return res.data;
};

export { addProduct, getProducts, getProduct, deleteProducts, editProduct };

import axios from "axios";

const addUser = async (data) => {
  const res = await axios.post(`http://localhost:4000/user-register`, data);
  return res.data;
};
const getRegister = async () => {
  const res = await axios.get(`http://localhost:4000/register`);
  return res.data;
};
export { addUser, getRegister };

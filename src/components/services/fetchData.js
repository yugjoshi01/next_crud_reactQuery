import axios from "axios";

export const fetchData = async () => {
  const data = axios.get("https://fakestoreapi.com/products");
  return data;
};

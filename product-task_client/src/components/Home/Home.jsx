import React from "react";
import { getProducts } from "../../api/products";
import GetProduct from "../Products/GetProducts/GetProducts";

function Home() {
  return (
    <div>
      <GetProduct />
    </div>
  );
}

export default Home;

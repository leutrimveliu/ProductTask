import "./App.css";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Register from "./components/User/Register/Register";
import Login from "./components/User/Login/Login";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Products from "./components/Products/GetProducts/GetProducts";
import CreateProduct from "./components/Products/CreateProduct/CreateProduct";
import Home from "./components/Home/Home";
import EditProduct from "./components/Products/EditProduct/EditProduct";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/Register" component={() => <Register />} />
          <Route path="/login" component={() => <Login />} />
          <Route path="/createproduct" component={() => <CreateProduct />} />
          <Route path="/product/:id" component={() => <EditProduct />} />
          <Route path="/" component={() => <Home />} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

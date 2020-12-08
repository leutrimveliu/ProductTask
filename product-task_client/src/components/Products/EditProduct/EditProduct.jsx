import React, { useState, useEffect } from "react";
import { editProduct, getProduct } from "../../../api/products";
import { useHistory, Link, Redirect, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",

    margin: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function EditProduct() {
  const history = useHistory();
  let { id } = useParams();
  const classes = useStyles();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [showEditForm, setShowEditForm] = useState(false);
  const [errMessage, setErrMessage] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [successMessage, setSuccessMessage] = useState(false);
  const getProductFields = async () => {
    const response = await getProduct(id);
    setProductDetails((oldDetails) => ({
      ...oldDetails,
      title: response.title,
      price: response.price,
      stock: response.stock,
    }));
    setShowEditForm(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails({ ...productDetails, [name]: value });
  };

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async (data, e) => {
    const registerData = {
      title: data.title,
      price: data.price,
      stock: data.stock,
      user_id: currentUser.user._id,
    };
    try {
      await editProduct(registerData, id);
      setTimeout(() => {
        history.push("/");
      }, 1000);
    } catch (e) {}
  };
  useEffect(() => {
    getProductFields();
  }, [currentUser]);
  if (!currentUser) {
    return <Redirect to={"/"} />;
  }
  return (
    <Grid container component="main" className={classes.root}>
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        style={{ width: "100%", marginBottom: 50, marginTop: 60 }}
      >
        <div className={classes.paper}>
          <Typography
            style={{ marginBottom: 20, marginTop: 20 }}
            component="h1"
            variant="h5"
          >
            Edit Product
          </Typography>
          <br />
          {errMessage && <Alert severity="error">{errMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          <br />
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              name="title"
              variant="outlined"
              fullWidth
              label="Product Title"
              type="text"
              id="title"
              InputLabelProps={{ shrink: true }}
              value={productDetails.title}
              onChange={handleChange}
              inputRef={register({ required: true, minLength: 3 })}
            />
            <p style={{ color: "red" }}>
              &#8203;
              {errors.title && errors.title.type === "required" && (
                <span>This field is required!</span>
              )}
              {errors.title && errors.title.type === "minLength" && (
                <span>This field requires minimum length of 3 characters!</span>
              )}
            </p>

            <TextField
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
              label="Product Price"
              name="price"
              type="decimal"
              id="price"
              value={productDetails.price}
              onChange={handleChange}
              inputRef={register({ required: true, min: 0.5, max: 1000000 })}
            />
            <p style={{ color: "red" }}>
              &#8203;
              {errors.price && errors.price.type === "required" && (
                <span>This field is required!</span>
              )}
              {errors.price && errors.price.type === "min" && (
                <span>Price must be at least 0.50 cent!</span>
              )}
              {errors.price && errors.price.type === "max" && (
                <span>Price must be maximum 1000000!</span>
              )}
            </p>

            <TextField
              variant="outlined"
              fullWidth
              name="stock"
              label="Product stock"
              type="number"
              InputLabelProps={{ shrink: true }}
              id="stock"
              onChange={handleChange}
              value={productDetails.stock}
              inputRef={register({
                min: 1,
                max: 10000,
                required: true,
              })}
            />
            <p style={{ color: "red" }}>
              &#8203;
              {errors.stock && errors.stock.type === "required" && (
                <span>This field is required!</span>
              )}
              {errors.stock && errors.stock.type === "min" && (
                <span>This field requires minimum 1 item in stock!</span>
              )}
              {errors.stock && errors.stock.type === "max" && (
                <span>This field requires maximum 10000 item in stock!</span>
              )}
            </p>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginBottom: "15px" }}
              type="submit"
            >
              Edit product
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

export default EditProduct;

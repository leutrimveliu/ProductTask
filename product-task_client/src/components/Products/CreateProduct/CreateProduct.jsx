import React, { useState, useEffect } from "react";
import { addProduct } from "../../../api/products";
import { useHistory, Link, Redirect } from "react-router-dom";
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
    height: "100vh",
  },
  darkTheme: {
    backgroundColor: "#424242",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#f48fb1",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function CreateProduct() {
  const history = useHistory();
  const classes = useStyles();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [errMessage, setErrMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async (data, e) => {
    const registerData = {
      title: data.title,
      price: data.price,
      stock: data.stock,
    };

    try {
      const response = await addProduct(registerData);
      setErrMessage(response.errMessage);
      setSuccessMessage(response.successMessage);
      e.target.reset();
      setTimeout(() => {
        history.push("/");
      }, 2000);
    } catch (e) {}
  };
  useEffect(() => {}, [currentUser]);
  if (!currentUser) {
    return <Redirect to={"/"} />;
  }
  return (
    <div>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography
            style={{ marginBottom: "20px" }}
            component="h1"
            variant="h5"
          >
            Register
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
              variant="outlined"
              fullWidth
              label="Product Price"
              name="price"
              type="number"
              id="price"
              inputRef={register({ required: true, minLength: 3 })}
            />
            <p style={{ color: "red" }}>
              &#8203;
              {errors.price && errors.price.type === "required" && (
                <span>This field is required!</span>
              )}
              {errors.price && errors.price.type === "minLength" && (
                <span>This field requires minimum length of 3 characters!</span>
              )}
            </p>

            <TextField
              variant="outlined"
              fullWidth
              name="stock"
              label="Product stock"
              type="stock"
              id="stock"
              inputRef={register({ required: true, minLength: 2 })}
            />
            <p style={{ color: "red" }}>
              &#8203;
              {errors.stock && errors.stock.type === "required" && (
                <span>This field is required!</span>
              )}
              {errors.stock && errors.stock.type === "minLength" && (
                <span>This field requires minimum length of 6 characters!</span>
              )}
            </p>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginBottom: "15px" }}
              type="submit"
            >
              Publish product
            </Button>
          </form>
        </div>
      </Grid>
    </div>
  );
}

export default CreateProduct;

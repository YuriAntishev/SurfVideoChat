import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Paper, Button, TextField, FormHelperText } from "@mui/material";
import { makeStyles } from "@mui/styles";
import "../css/Login.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "100vh",
    alignItems: "center",
  },
  paper: {
    width: 300,
    height: 300,
  },
}));

export default function Login() {
  const { push } = useHistory();
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const LogIn = () => {
    if (username === "") {
      setError("Please, enter your name!");
      return null;
    }
    localStorage.setItem("username", username);
    push("/videochat");
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={15}>
        <div className="form_container">
          <h1> VideoChat </h1>
          <TextField
            className="input"
            id="standard-password-input"
            label="Name"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            autoComplete="off"
          />
          <FormHelperText>{error}</FormHelperText>
          <br />
          <br />
          <Button onClick={LogIn} variant="contained" color="primary">
            LogIn
          </Button>
        </div>
      </Paper>
    </div>
  );
}

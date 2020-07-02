import React from "react";
import ReactDOM from "react-dom";
import MyComponent from "./components/MyComponents.jsx";
import "./index.scss";
ReactDOM.render(
  React.createElement(MyComponent, { title: "Hello" }),
  document.getElementById("root")
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "../app/page";
import "../app/globals.css";
import "../app/executive-polish.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("The proposal root element is missing.");
}

createRoot(root).render(
  <StrictMode>
    <Home />
  </StrictMode>,
);
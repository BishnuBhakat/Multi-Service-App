const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/products", require("./routes/product.routes"));
// app.use("/api/orders", require("./routes/order.routes"));

module.exports = app;






const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const addressRoutes = require("./routes/address.routes");


app.use(cors({
  origin: "*", // for development
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/address", addressRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));

// app.use("/api/products", require("./routes/product.routes"));
// app.use("/api/orders", require("./routes/order.routes"));

module.exports = app;
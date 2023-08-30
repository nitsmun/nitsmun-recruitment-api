const express = require("express");
const app = express();
const userRoutes = require("./routes/UserRoutes");
const connectToDB = require("./db/Dbconnection")
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

connectToDB();

app.use("/", userRoutes);
module.exports = app;
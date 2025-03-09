require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const contactRouter = require("./routes/contact.router");
const app = express();
import sequelize from "./services/postgresql.database";
import connectMongoDB from "./services/mongodb.database";

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    parameterLimit: 100000000,
    limit: "500mb",
  })
);

connectMongoDB();

app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

app.use("/", contactRouter);

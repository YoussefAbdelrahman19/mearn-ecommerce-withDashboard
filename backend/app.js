const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
app.use(
  cors({
    origin: ["http://localhost:3000", "https://eshop-tutorial-cefl.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
const sendMail = require("./utils/sendMail");

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/", express.static(path.join(__dirname, "./uploads")));

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}
app.use("/test", async (req, res) => {
  try {
    // console.log(process.env);
    await sendMail({
      email: "ahmed.mohamed.abdelkader1@gmail.com",
      subject: "Test",
      message: `Hello world`,
    });
    res.send("Hello world!");
  } catch (error) {
    res.send(error);
  }
});

// import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");

app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/withdraw", withdraw);

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;

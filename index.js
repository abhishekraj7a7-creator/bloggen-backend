require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorMiddleware = require('./middlewares/error.middleware');
const authRouter = require('./routers/auth');
const userRouter = require('./routers/user');
const categoryRouter = require('./routers/category');
const postRouter = require('./routers/post');

const app = express();
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("DB connected"))
    .catch((e) => console.log(e.message));

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use(express.static("public"));
// app.use("/*", express.static("public"));

app
    .use("/api/auth", authRouter)
    .use("/api/user", userRouter)
    .use("/api/categories", categoryRouter)
    .use("/api/post", postRouter)


app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
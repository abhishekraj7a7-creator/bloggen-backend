const model = require("../models/User");
const User = model.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// const { privateKey } = JSON.parse(process.env.PRIVATE_KEY);
const privateKey = `-----BEGIN RSA PRIVATE KEY-----\n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\n-----END RSA PRIVATE KEY-----`
const expiresInMinutes = 60 * 24;
exports.registration = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();

    const token = jwt.sign({ email: user.email, id: user._id }, privateKey, {
      algorithm: "RS256",
      expiresIn: expiresInMinutes * 60,
    });

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: new Date(Date.now() + expiresInMinutes * 60 * 1000),
      })
      .json({
        email: user.email,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        categories: user.categories,
      });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return next({ status: 409, error: "Email is already registered" });
    }
    next({});
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next({ status: 404, error: "Invalid email or password" });
    }

    const isAuth = bcrypt.compareSync(password, user.password);
    console.log(isAuth);

    if (!isAuth) {
      return next({ status: 404, error: "Invalid email or password" });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, privateKey, {
      algorithm: "RS256",
      expiresIn: expiresInMinutes * 60,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: new Date(Date.now() + expiresInMinutes * 60 * 1000),
      })
      .json({
        email: user.email,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        categories: user.categories,
      });
  } catch (error) {
    console.log(error);
    next({});
  }
};

exports.logout = (req, res, next) => {
  try {
    res.clearCookie("token").json({ message: "Logout successfully" });
  } catch (error) {
    next({});
  }
};

exports.identity = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId, {
      _id: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
      avatar: 1,
      categories: 1,
    });

    const token = jwt.sign({ email: user.email, id: user._id }, privateKey, {
      algorithm: "RS256",
      expiresIn: expiresInMinutes * 60,
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: new Date(Date.now() + expiresInMinutes * 60 * 1000),
      })
      .json(user);
  } catch (error) {
    console.log(error);
    next({});
  }
};

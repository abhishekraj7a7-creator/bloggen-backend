const { deleteOldPhoto } = require("../middlewares/multer.middleware");
const model = require("../models/User");
const User = model.User;
const bcrypt = require("bcryptjs");

exports.profile = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id, {
      password: 0,
      likedPosts: 0,
    }).populate({
      path: "posts",
      options: { sort: { likers: -1 }, limit: 3 },
      select: "title slug blogCover summary createdAt _id",
    });
    res.json(user);
  } catch (error) {
    next({ status: 404, error: "User not found" });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;

    let { user: userData, password } = req.body;
    userData = JSON.parse(userData);

    const user = await User.findById(userId);

    if (!bcrypt.compareSync(password, user.password)) {
      return next({ status: 401, error: "Incorrect Password 😥" });
    }
    delete user.password;

    if (req.files.avatar) {
      deleteOldPhoto(user.avatar);
      userData.avatar = req.files.avatar[0].location;
    }

    if (req.files.cover) {
      deleteOldPhoto(user.cover);
      userData.cover = req.files.cover[0].location;
    }

    delete userData.email;
    delete userData.dateJoined;

    const result = await user.updateOne(userData);

    res.json({ message: "Profile updated successfully." });

  } catch (error) {
    console.log("update-profile-error" + error);
    return next({ error: error });
  }
};

exports.addCategories = async (req, res, next) => {
  try {
    const userId = req.userId;

    const { categories } = req.body;

    // const user = await User.findById(id);
    // user.categories.addToSet(...categories);

    // const updatedUserData = await user.save();

    // const updatedUserData = await User.findByIdAndUpdate(
    //     userId,
    //     { $addToSet: { categories: {$each : categories}}},
    //     { new: true, select: 'categories' }
    // );

    const updatedUserData = await User.findByIdAndUpdate(
      userId,
      { categories: categories },
      { new: true, select: "categories" }
    );

    res.json(updatedUserData);
  } catch (error) {
    console.log(error);
    next({});
  }
};

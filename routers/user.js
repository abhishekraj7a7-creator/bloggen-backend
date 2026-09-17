const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const authMiddleware = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/multer.middleware");

router
  .get("/profile/:id", userController.profile)
  .patch(
    "/profile/update",
    authMiddleware,
    upload.fields([{ name: "avatar" }, { name: "cover" }]),
    userController.updateProfile
  )
  .patch("/add-categories/", authMiddleware, userController.addCategories);

module.exports = router;

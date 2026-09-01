const express = require("express");
const router = express.Router();

const postController = require("../controllers/post");
const authMiddleware = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/multer.middleware");

router
  .post(
    "/create",
    authMiddleware,
    upload.single("blogCover"),
    postController.createPost
  )
  .get("/all", postController.getAllPosts)
  .get("/", postController.userPosts)
  .get("/likedPosts", authMiddleware, postController.likedPosts)
  .get("/:slug", postController.getPost)
  .patch("/:id/like", authMiddleware, postController.likePost)
  .patch("/:id/dislike", authMiddleware, postController.dislikePost);

module.exports = router;

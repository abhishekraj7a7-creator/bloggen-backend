const Post = require("../models/Post");
const { User } = require("../models/User");
const Category = require("../models/Category");
const slugify = require("slugify");

exports.createPost = async (req, res, next) => {
  try {
    const userId = req.userId;
    const data = JSON.parse(req.body.data);
    const blogCover = req.file;
    const content = req.body.content;

    delete data.blogCover;

    let categories = await Category.find({
      name: { $in: data.categories_names },
    });
    const post = new Post(data);

    post.slug = slugify(post.title) + "-" + Date.now().toString();
    post.content = content;

    if (blogCover) {
      post.blogCover = blogCover.location;
    }

    categories = categories.map((category) => {
      post.categories.push(category._id);
      return category;
    });

    await User.updateOne({ _id: userId }, { $addToSet: { posts: post.id } });

    post.author = userId;

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.log("create-post-error: " + error);
    next({});
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const post = await Post.findOne({ slug })
      .populate({
        path: "author",
        select: "firstName lastName _id email avatar",
      })
      .populate({ path: "categories", select: "-posts" });

    if (!post) {
      return next({ error: "No post found", status: 404 });
    }

    const posts = await Post.find(
      { categories: { $in: post.categories } },
      {
        categories: 1,
        title: 1,
        slug: 1,
        summary: 1,
        blogCover: 1,
        createdAt: 1,
        author: 1,
      }
    )
      .populate({ path: "author", select: "firstName lastName _id avatar" })
      .limit(4);

    res.json({
      post,
      relatedPosts: posts.filter(
        (relatedPost) => relatedPost.slug !== post.slug
      ),
    });
  } catch (error) {
    next({});
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const slug = req.query.category;
    const category = await Category.findOne({ slug }, { _id: 1 });

    let totalItems = 0;

    if (category) {
      totalItems = await Post.countDocuments({
        categories: { $in: category._id },
      });
    } else {
      totalItems = await Post.estimatedDocumentCount();
    }

    if (!totalItems) {
      return res.status(404).json({ error: "Blogs not found" });
    }

    // totalItems = await Post.countDocuments({categories: {$in: category.id}});
    const pageSize = parseInt(req.query.pageSize) || totalItems;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * pageSize;
    const totalPages = Math.ceil(totalItems / pageSize);

    if (page > totalPages) {
      return res.status(404).json({ error: "Page is out of bounds" });
    }

    const filter = category && { categories: { $in: category._id } };

    const posts = await Post.find(filter, {
      title: 1,
      slug: 1,
      summary: 1,
      blogCover: 1,
      author: 1,
      createdAt: 1,
    })
      .populate({ path: "author", select: "firstName lastName _id avatar" })
      // .populate({ path: "categories", select: "-posts" })
      .skip(startIndex)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    res.json({
      totalItems,
      // pageSize,
      // page,
      totalPages,
      posts,
    });
  } catch (error) {
    console.log(error);
    next({});
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    console.log(userId);

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { likedPosts: postId } },
      { new: true }
    );
    const post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likers: userId } },
      { new: true, select: "likers" }
    );

    console.log(post);

    return res.json({ likers: post.likers });
  } catch (error) {
    console.log(error);
    next({});
  }
};

exports.dislikePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { likedPosts: postId } },
      { new: true }
    );
    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likers: userId } },
      { new: true, select: "likers" }
    );

    console.log(user);
    console.log(post);

    return res.json({ likers: post.likers });
  } catch (error) {
    console.log(error);
    next({});
  }
};

exports.userPosts = async (req, res, next) => {
  try {
    const userId = req.query.user;
    // const posts = await Post.find({ author: userId }).populate({
    //   path: "author",
    //   select: "firstName lastName _id avatar",
    // });
    const posts = await User.findById(userId, {
      firstName: 1,
      lastName: 1,
      avatar: 1,
      bio: 1,
      posts: 1,
    }).populate({
      path: "posts",
      select: "title blogCover slug summary createdAt",
    });

    res.json(posts);
  } catch (error) {
    console.log(error);
    next({});
  }
};

exports.likedPosts = async (req, res, next) => {
  try {
    const userId = req.userId;
    const posts = await User.findById(userId, { likedPosts: 1 }).populate({
      path: "likedPosts",
      select: "title blogCover slug summary createdAt",
    });
    return res.json(posts.likedPosts);
  } catch (error) {
    console.log(error);
    next({});
  }
};

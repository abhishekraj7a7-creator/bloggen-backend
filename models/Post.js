const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    blogCover: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    likers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    tags: {
        type: [String],
        required: true,
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
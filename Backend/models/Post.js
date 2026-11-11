const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    imagePublicId: {
        type: String,
        default: ""
    },
    caption: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
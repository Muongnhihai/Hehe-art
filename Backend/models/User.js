
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    displayName: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: "",
        maxlength: 200
    },

    avatarUrl: {
        type: String,
        default: ""
    },

    avatarPublicId: {
        type: String,
        default: ""
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);

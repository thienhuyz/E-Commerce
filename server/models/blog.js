const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numberView: {
        type: Number,
        default: 0
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    image: {
        type: String,
        default: 'https://thumbs.dreamstime.com/b/blog-information-website-concept-workplace-background-text-view-above-blog-information-website-concept-118021391.jpg'
    },
    author: {
        type: String,
        default: 'Admin'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);
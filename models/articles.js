var mongoose = require("mongoose"),
    Schema = mongoose.Schema,

    ArticleSchema = new Schema({
        title: {
            type: String,
            unique: true,
            required: true
        },
        link: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        saved: {
            type: Boolean,
            default: false,
            required: true
        },
        // This only saves one note's ObjectId, ref refers to the Note model
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    });

var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;

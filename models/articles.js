var mongoose = require("mongoose"),
    Schema = mongoose.Schema,

    ArticleSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        link: {
            type: String,
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

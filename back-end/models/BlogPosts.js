import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
    _id: true,
  },
);

const blogSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Sport", "Videogames", "Actuality"],
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
    },
    readTime: {
      value: {
        type: Number,
        default: 0,
      },
      unit: {
        type: String,
        default: "minute",
      },
    },
    author: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    comments: [commentsSchema],
  },
  {
    collection: "blogPosts",
    timestamps: true,
  },
);

export default mongoose.model("BlogPost", blogSchema);

// {
//     "category": "Cronaca",
//     "title": "Prova",
//     "cover": "a",
//     "readTime": 1,
//     "author": "simo7820@gmail.com",
//     "content": "Lorem Ipsum"
// }

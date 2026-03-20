import {Schema,model} from "mongoose";

const videoSchema = new Schema(
  {
    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problems",
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publicId:{
        type: String,
        required: true,
        maxLength: 500,
    },
    cloudinaryUrl:{
        type: String,
        required: true,
        maxLength: 500,
    },
    secureUrl: {
      type: String,
      required: true,
      maxLength: 500,
    },
    format:{
      type: String,
      required: true,
      maxLength: 500,
    },
    views:{
      type:Number,
      default:0
    },
    likes:{
      type:[{type: Schema.Types.ObjectId,
      ref: "User",}]
    },
    size:{
      type: Number,
      required: true,
      maxLength: 500,
    },
    thumbnailUrl: {
      type:String,
      required: true,
    },
  },
  { timestamps: true }
);

const Video = model("Video", videoSchema);

export default Video;
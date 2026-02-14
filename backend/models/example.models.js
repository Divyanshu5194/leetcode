import {Schema,model} from "mongoose";

const exampleSchema = new Schema(
  {
    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problems",
      required: true,
    },

    input: {
      type: String,
      required: true,
      maxLength: 500,
      trim: true,
    },

    output: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

const Examples = model("Examples", exampleSchema);

export default Examples;



// process.stdout.write("{")
// for(let key of Object.keys({...exampleSchema.tree,createdBy:undefined,problem:undefined,createdAt:undefined,__v:undefined,id:undefined})){
//   process.stdout.write(`|| !${key},`)
// }
// process.stdout.write("}")

// process.stdout.write("{")
// for(let key of Object.keys(exampleSchema.tree)){
//   process.stdout.write(`${key},`)
// }
// process.stdout.write("}")



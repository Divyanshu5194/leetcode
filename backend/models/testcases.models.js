import {Schema,model} from "mongoose";

const testCaseSchema = new Schema(
  {
    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problems",
      required: true,
    },
    order:{
        type:Number,
        default:1
    },
    input: {
      type: String,
      required: [true,"input is required"],
      maxLength: 600,
      trim: true,
    },
    output: {
      type: String,
      required: [true,"output is required"],
      trim: true,
      maxLength: 500,
    },
    isHidden:{
        type:Boolean,
        default:false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

testCaseSchema.pre("save",async function(next){ 
    if(this.isNew){
        const existingorder=await this.constructor.countDocuments({
            problem:this.problem
        });
        this.order=existingorder+1
    }
    next()
})

const TestCases=model("TestCases",testCaseSchema)

export default TestCases

// process.stdout.write("{")
// for(let key of Object.keys(testCaseSchema.tree)){
//   process.stdout.write(`|| !${key},`)
// }
// process.stdout.write("}")

// process.stdout.write("{")
// for(let key of Object.keys(testCaseSchema.tree)){
//   process.stdout.write(`${key},`)
// }
// process.stdout.write("}")
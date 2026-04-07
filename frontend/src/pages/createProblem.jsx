import { useState } from "react";
import LanguageSelectorFeild from "../components/LanguageSelector";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useSelector } from "react-redux";
import { axiosClient } from "../utils/axiosClient";
import Popup from "../components/Popup";
import { CircleX } from "lucide-react";

export default function createProblemPage(){  

  const {languageArray}=useSelector((state)=>state.auth)
  const [language,setLanguage]=useState(languageArray[0])

  const [response,setResponse]=useState(null)
  const [error,setError]=useState(null)
  const [loading,setLoading]=useState(false)


  const safeJsonParse = (val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (e) {
        return val; // If parsing fails, pass the string so Zod can throw a validation error
      }
    }
    return val;
  };

  const exampleSchema=z.object({
    input:z.string(),
    output:z.string(),
    explanation:z.string().optional(),
  })

  const solutionSchema=z.object({
    language:z.string(),
    solution:z.string()
  })

  const testCaseSchema=z.object({
    input:z.preprocess(safeJsonParse,z.array(z.object({
      value:z.string(),
      dataType:z.string()
    }))),
    output:z.preprocess(safeJsonParse,z.object({
      value:z.string(),
      dataType:z.string()
    })),
    isHidden:z.boolean()
  })
  
  const boilerplateCodeSchema=z.object({
    language:z.string(),
    code:z.string()
  })


  const problemSchema=z.object({
        title:z.string(),
        slug:z.string(),
        difficulty:z.enum(["Easy","Medium","Hard"]),
        topics:z.string(),
        statement:z.string(),
        constraints:z.string(),
        examples:z.array(exampleSchema),
        solutions:z.array(solutionSchema),
        testCases:z.array(testCaseSchema),
        followUpQuestions:z.string(),
        boilerplateCodes:z.array(boilerplateCodeSchema),
        description:z.string(),
        tags:z.string()
    })

    

    const {register,handleSubmit,formState: { errors },control} = useForm({resolver:zodResolver(problemSchema)});

    const { fields: exampleFields, append: addExample, remove: removeExample } = useFieldArray({
    control,
    name: "examples"
  })

  const { fields: solutionFeilds, append: addSolution, remove: removeSolution } = useFieldArray({
    control,
    name: "solutions"
  })

  const { fields: testcaseFeilds, append: addTestCase, remove: removeTestCase } = useFieldArray({
    control,
    name: "testCases"
  })

  const { fields: boilerplateCodeFeilds, append: addBoilerPlateCode, remove: removeBoilerPlateCode } = useFieldArray({
    control,
    name: "boilerplateCodes"
  })

  // const [constraints, setConstraints] = useState([])
  // const [followUpQuestions, setFollowUpQuestions] = useState([])
  // const [examples, setExamples] = useState([{input:null,output:null,explanation:null}])
  // const [testcases, setTestcases] = useState([])
  // const [solutions, setSolutions] = useState([])
  // const [topics,setTopics]=useState([])
  // const [tags,setTags]=useState([])
  // const [boilerplateCodes, setBoilerplateCodes] = useState([])
  // const [solutionLanguage,setSolutionLanguage]=useState(null)
  // const [boilerPlateLanguage,setBoilerPlateLanguage]=useState(null)
  // console.log({signupSchema})

  async function submit(data) {
    data.topics=data.topics.split(",")
    data.constraints=data.constraints.split(",")
    data.followUpQuestions=data.followUpQuestions.split(",")
    data.tags=data.tags.split(",")

    setLoading(true)
    try{
      const {data:response}=await axiosClient.post("problems/create",data)
      console.log({response})
      setResponse(response.data)
      setError(null)
    }
    catch(error){
      console.log({error})
      setError(error.response.data.message || error.response.data.error)
      setResponse(null)
    }
    finally{
      setLoading(false)
    }
  }

  async function onSubmit(data){
    console.log({data})
    await submit(data)
  }

  console.log({response,error,loading})

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg shadow-md font-sans">
      <div className="fixed top-2">
        {loading && <Popup message={"Submitting problem to backend"} mode={"info"}></Popup>}
        {!loading && response && <Popup message={response} mode={"success"}></Popup>}
        {!loading && error && <Popup message={error} mode={"error"}></Popup>}
      </div>
    <h1 className="text-2xl font-bold mb-6 border-b pb-2">Create Problem Form</h1>

    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      
      {/* Basic Information */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" >Title</label>
            <input type="text" placeholder="problem title" {...register("title",{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700" />
            {errors.title && <p className='text-red-700'>{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" >Statement</label>
            <input type="text" placeholder="Enter Problem Statement" {...register("statement",{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700" />
            {errors.statement && <p className='text-red-700'>{errors.statement.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <select {...register("difficulty",{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700">
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" >Topics</label>
            <input type="text" placeholder="Math,Array,etc" {...register("topics",{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700" />
            {errors.topics && <p className='text-red-700'>{errors.topics.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" >Slug</label>
            <input type="text" placeholder="e.g., sum-of-two-numbers" {...register("slug",{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700" />
            {errors.slug && <p className='text-red-700'>{errors.slug.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea rows="2" placeholder="Brief description..." {...register("description",{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></textarea>
          {errors.description && <p className='text-red-700'>{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Constraints</label>
          <textarea rows="2" placeholder="constraints seperated by comma" {...register("constraints",{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></textarea>
          {errors.constraints && <p className='text-red-700'>{errors.constraints.message}</p>}
        </div>
      </section>

      <hr />
      <div className="btn btn-accent" onClick={()=>{
        addExample({input:"",output:"",explanation:""})
      }}>Add Example</div>

      {
        
        exampleFields.map((example,index)=>(
          <div key={example.id}>
            <CircleX className="bg-red-500" onClick={()=>{removeExample(index)}}>remove solution</CircleX>
            <label className="block text-sm font-medium mb-1">input</label>
            <input placeholder="Full problem statement..." {...register(`examples.${index}.input`,{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></input>
            
            
            <label className="block text-sm font-medium mb-1">output</label>
            <input placeholder="Full problem statement..." {...register(`examples.${index}.output`,{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></input>
            

            <label className="block text-sm font-medium mb-1">explanation</label>
            <textarea rows="2" placeholder="Full problem statement..." {...register(`examples.${index}.explanation`,{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></textarea>
          </div>
        ))
      }
      <hr />

      <div className="btn btn-accent" onClick={()=>{
        addSolution({language:'',solution:''})
      }}>Add Solution</div>

      {
        //solutions

        solutionFeilds.map((solution,index)=>(
          <div key={solution.id}>
            <CircleX className="bg-red-500" onClick={()=>{removeSolution(index)}}>remove solution</CircleX>
            
            <label className="block text-sm font-medium mb-1">language</label>
            <input placeholder="Full problem statement..." {...register(`solutions.${index}.language`,{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></input>

            <label className="block text-sm font-medium mb-1">solution</label>
            <textarea placeholder="Full problem statement..." {...register(`solutions.${index}.solution`,{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></textarea>
            </div>
        ))

      }

      <hr />

      <div className="btn btn-accent" onClick={()=>{
        addTestCase({input:null,output:null,isHidden:false})
      }}>add testcase</div>

      {
        testcaseFeilds.map((testcase,index)=>(<div key={testcase.id}>
          <CircleX color="red" onClick={()=>{removeTestCase(index)}}>remove solution</CircleX>
            <label className="block text-sm font-medium mb-1">input</label>
            <input placeholder="input : {'value':2,'dataType':'Number'}" {...register(`testCases.${index}.input`,{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></input>

            <label className="block text-sm font-medium mb-1">output</label>
            <input placeholder="output : {'value':2,'dataType':'Number'}" {...register(`testCases.${index}.output`,{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></input>

            <div className="flex w-min p-2 gap-2 justify-center">
              <input type="checkbox" {...register(`testCases.${index}.isHidden`,{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></input>
              <label className="block text-sm font-medium mb-1">isHidden</label>
            </div>

        </div>))
      }

      <hr />
      <div className="btn btn-accent" onClick={()=>{
        addBoilerPlateCode({language:'',code:''})
      }}>add boiler plate code</div>

      {
        boilerplateCodeFeilds.map((boilerplatecode,index)=>(<div key={boilerplatecode.id}>

          <CircleX color="red" onClick={()=>{
            removeBoilerPlateCode(index)
          }}>remove</CircleX>

          <label className="block text-sm font-medium mb-1">language</label>
            <LanguageSelectorFeild language={language} setLanguage={setLanguage} placeholder="Language?" {...register(`boilerplateCodes.${index}.language`,{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></LanguageSelectorFeild>

            <label className="block text-sm font-medium mb-1">code</label>
            <input placeholder="code" {...register(`boilerplateCodes.${index}.code`,{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></input>
        </div>))
      }

      <div>
        <label className="block text-sm font-medium mb-1">followUpQuestions</label>
        <textarea rows="2" placeholder="floow up questions seperated by comma" {...register("followUpQuestions",{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></textarea>
        {errors.followUpQuestions && <p className='text-red-700'>{errors.followUpQuestions.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">tags</label>
        <textarea rows="2" placeholder="Brief description..." {...register("tags",{required:true})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"></textarea>
        {errors.tags && <p className='text-red-700'>{errors.tags.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button className="btn btn-accent" type="submit">Submit</button>
      </div>

    </form>
  </div>
  );
};
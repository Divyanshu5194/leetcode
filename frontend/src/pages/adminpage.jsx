import { useForm,} from "react-hook-form"
import { axiosClient } from "../utils/axiosClient"
import { useSelector } from "react-redux"

export default function Adminpage(){

    const {isAuthenticated,error,loading}=useSelector((state)=>state.auth)

    const {register,handleSubmit,formState:{errors}}=useForm({})

    const onsubmit=(data)=>{
        axiosClient.post("/",data)
    }

    if(error){
        return (
            <>
            <div>An Error Occured</div>
            </>
        )
    }
    return(
        <>
        <h2>Create a new problem</h2>
        </>
    )
}
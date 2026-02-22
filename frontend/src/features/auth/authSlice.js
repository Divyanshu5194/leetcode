import { createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import { axiosClient } from "../../utils/axiosClient"

const login=createAsyncThunk("/auth/login",async (loginInfo,{rejectWithValue})=>{
    try{
        const response=await axiosClient.post("/login",loginInfo)
        return response.data.data
    }
    catch(error){
        console.log({error})
        return rejectWithValue(error.response.data)
    }
})

const register=createAsyncThunk("/auth/register",async (registerData,{rejectWithValue})=>{
    try{
        const response=await axiosClient.post("/register",registerData)
        return response.data.data
    }
    catch(error){
        console.log({REGECTED_WITH_VALUE_:error.response.data.error})
        return rejectWithValue(error.response.data.error)
    }
})

const checkAuth=createAsyncThunk("/auth/checkAuth",async (_,{rejectWithValue})=>{
    try{
        const response=await axiosClient.get("/checkAuth")
        return response.data.data
    }
    catch(error){
        return rejectWithValue(error.response.data)
    }
})

const refresh=createAsyncThunk("/auth/refresh",async (_,{rejectWithValue})=>{
    try{
        const response=await axiosClient.get("/refresh")
        return null
    }
    catch(error){
        console.log({error})
        return rejectWithValue(error.response.data)
    }
})

const logout=createAsyncThunk("/auth/logout",async (_,{rejectWithValue})=>{
    try{
        const response=await axiosClient.post("/logout")
        return null
    }
    catch(error){
        console.log({error})
        return rejectWithValue(error.response.data)
    }
})

const authSlice=createSlice({
    name:"auth",
    initialState:{
        error:null,
        loading:false,
        isAuthenticated:false,
        user:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        //login
        builder.addCase(login.pending,(state,action)=>{
            state.loading=true
        })
        builder.addCase(login.fulfilled,(state,action)=>{
            state.loading=false
            state.isAuthenticated=!!action.payload
            state.user=action.payload
        })
        builder.addCase(login.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload || "Something went wrong"
        })

        //logout
        builder.addCase(logout.pending,(state,action)=>{
            state.loading=true
        })
        builder.addCase(logout.fulfilled,(state,action)=>{
            state.loading=false
            state.isAuthenticated=false
            state.user=null
        })
        builder.addCase(logout.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload || "Something went wrong"
        })

        //checkAuth
        builder.addCase(checkAuth.pending,(state,action)=>{
            state.loading=true
        })
        builder.addCase(checkAuth.fulfilled,(state,action)=>{
            state.loading=false
            state.isAuthenticated=!!action.payload
            state.user=action.payload
        })
        builder.addCase(checkAuth.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload || "Something went wrong"
        })

        //register
        builder.addCase(register.pending,(state,action)=>{
            state.loading=true
        })
        builder.addCase(register.fulfilled,(state,action)=>{
            state.loading=false
            state.isAuthenticated=!!action.payload
            state.user=action.payload
        })
        builder.addCase(register.rejected,(state,action)=>{
            console.log({REGISTER_REJECTED:action.payload})
            state.loading=false
            state.error=action.payload || "Something went wrong"
        })

        //refresh
        builder.addCase(refresh.pending,(state,action)=>{
            
        })
        builder.addCase(refresh.fulfilled,(state,action)=>{
            state.loading=false
            state.isAuthenticated=!!action.payload
        })
        builder.addCase(refresh.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload || "Something went wrong"
        })
    }   
})


const authReducer=authSlice.reducer

export {authReducer,checkAuth,login,logout,register}
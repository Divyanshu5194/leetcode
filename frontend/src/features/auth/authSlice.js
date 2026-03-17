import { createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import { axiosClient } from "../../utils/axiosClient"
import axios from "axios"

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

const fetchLanguages=createAsyncThunk("/auth/languages",async(_,{rejectWithValue})=>{
    try{
        console.log("fetching language list")
        const response=await axiosClient.get("/Problems/languages")
        return [
    { "id": 45,  "name": "Assembly (NASM 2.14.02)" },
    { "id": 46,  "name": "Bash (5.0.0)" },
    { "id": 47,  "name": "Basic (FBC 1.07.1)" },
    { "id": 110, "name": "C (Clang 19.1.7)" },
    { "id": 103, "name": "C (GCC 14.1.0)" },
    { "id": 105, "name": "C++ (GCC 14.1.0)" },
    { "id": 86,  "name": "Clojure (1.10.1)" },
    { "id": 51,  "name": "C# (Mono 6.6.0.161)" },
    { "id": 77,  "name": "COBOL (GnuCOBOL 2.2)" },
    { "id": 55,  "name": "Common Lisp (SBCL 2.0.0)" },
    { "id": 90,  "name": "Dart (2.19.2)" },
    { "id": 56,  "name": "D (DMD 2.089.1)" },
    { "id": 57,  "name": "Elixir (1.9.4)" },
    { "id": 58,  "name": "Erlang (OTP 22.2)" },
    { "id": 87,  "name": "F# (.NET Core SDK 3.1.202)" },
    { "id": 59,  "name": "Fortran (GFortran 9.2.0)" },
    { "id": 107, "name": "Go (1.23.5)" },
    { "id": 88,  "name": "Groovy (3.0.3)" },
    { "id": 61,  "name": "Haskell (GHC 8.8.1)" },
    { "id": 91,  "name": "Java (JDK 17.0.6)" },
    { "id": 102, "name": "JavaScript (Node.js 22.08.0)" },
    { "id": 111, "name": "Kotlin (2.1.10)" },
    { "id": 64,  "name": "Lua (5.3.5)" },
    { "id": 79,  "name": "Objective-C (Clang 7.0.1)" },
    { "id": 65,  "name": "OCaml (4.09.0)" },
    { "id": 66,  "name": "Octave (5.1.0)" },
    { "id": 67,  "name": "Pascal (FPC 3.0.4)" },
    { "id": 85,  "name": "Perl (5.28.1)" },
    { "id": 98,  "name": "PHP (8.3.11)" },
    { "id": 69,  "name": "Prolog (GNU Prolog 1.4.5)" },
    { "id": 113, "name": "Python (3.14.0)" },
    { "id": 99,  "name": "R (4.4.1)" },
    { "id": 72,  "name": "Ruby (2.7.0)" },
    { "id": 108, "name": "Rust (1.85.0)" },
    { "id": 112, "name": "Scala (3.4.2)" },
    { "id": 82,  "name": "SQL (SQLite 3.27.2)" },
    { "id": 83,  "name": "Swift (5.2.3)" },
    { "id": 101, "name": "TypeScript (5.6.2)" }
]
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
        user:null,
        languageArray:[],
        checkAuthError:null
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
            
        })
        builder.addCase(checkAuth.fulfilled,(state,action)=>{
            state.loading=false
            state.isAuthenticated=!!action.payload
            state.user=action.payload
        })
        builder.addCase(checkAuth.rejected,(state,action)=>{
            state.loading=false
            state.checkAuthError=action.payload || "Something went wrong"
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
            console.log({LANGUAGE_LIST:action.payload})
            state.loading=false
            state.isAuthenticated=!!action.payload
        })
        builder.addCase(refresh.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload || "Something went wrong"
        })

        //languageArray
        builder.addCase(fetchLanguages.pending,(state,action)=>{
            state.loading=true
        })
        builder.addCase(fetchLanguages.fulfilled,(state,action)=>{
            state.loading=false
            state.languageArray=action.payload
        })
        builder.addCase(fetchLanguages.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload || "Something went wrong"
        })
    }   
})


const authReducer=authSlice.reducer

export {authReducer,checkAuth,login,logout,register,fetchLanguages}
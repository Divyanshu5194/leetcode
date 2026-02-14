import validator from "validator"

function isValidRegisteration(req,res){

    const {username,email,password}=req.body

    if(!(username && email && password)){
      throw new Error("Please Enter all the feilds")
    }

    const registerobj=req.body
    if(registerobj.username.length>20){
      throw new Error("Username should not be greater than 20 characters")
    }

    if(registerobj.password<=8 || registerobj.password>=20){
      throw new Error("Password Must Be Between 8-20 characters")
    }

    if(!validator.isEmail(registerobj.email)){
      throw new Error("Plase enter a valid email")
    }
    if(password.length<8 || password.length>31){
      throw new Error("Password should be between 8-30 characters")
    }
    
    if(!validator.isStrongPassword(registerobj.password)){
      throw new Error("Choose a Strong Password")
    }
}

export default isValidRegisteration

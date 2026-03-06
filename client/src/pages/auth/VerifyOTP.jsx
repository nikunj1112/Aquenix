import { useState } from "react"
import { verifyOtp } from "../../services/authService"

function VerifyOTP(){

const [otp,setOtp] = useState(["","","","","",""])

const handleChange=(value,index)=>{

const newOtp=[...otp]

newOtp[index]=value

setOtp(newOtp)

if(value && index<5){

document.getElementById(`otp${index+1}`).focus()

}

}

const submit=()=>{

verifyOtp({otp:otp.join("")})

}

return(

<div className="auth-wrapper">

<div className="auth-card text-center">

<h4 className="mb-4">Verify OTP</h4>

<div className="d-flex justify-content-between">

{otp.map((data,index)=>(

<input
key={index}
id={`otp${index}`}
maxLength="1"
className="form-control text-center"
style={{width:"50px"}}
onChange={(e)=>handleChange(e.target.value,index)}
/>

))}

</div>

<button
className="btn btn-primary w-100 mt-4"
onClick={submit}
>

Verify OTP

</button>

</div>

</div>

)

}

export default VerifyOTP
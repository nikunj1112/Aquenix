import { useState } from "react";
import { forgotPassword } from "../../services/authService.js";

function ForgotPassword(){

const [email,setEmail] = useState("");

const sendOtp=async(e)=>{

e.preventDefault();

try{

await forgotPassword({email});

alert("OTP sent");

}catch(err){

alert(err.response?.data?.message);

}

};

return(

<div className="auth-container">

<div className="auth-right">

<form className="auth-form" onSubmit={sendOtp}>

<h2>Forgot password?</h2>

<input
placeholder="Enter email"
onChange={(e)=>setEmail(e.target.value)}
/>

<button className="primary-btn">

Send OTP

</button>

</form>

</div>

</div>

);

}

export default ForgotPassword;
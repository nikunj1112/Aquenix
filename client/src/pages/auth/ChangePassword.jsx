import { useState } from "react";
import { changeForgotPassword } from "../../services/authService";

function ChangePassword(){

const [form,setForm] = useState({
email:"",
otp:"",
newPassword:""
});

const handleChange=(e)=>{

setForm({
...form,
[e.target.name]:e.target.value
});

};

const submit=async(e)=>{

e.preventDefault();

try{

await changeForgotPassword(form);

alert("Password changed successfully");

}catch(err){

alert(err.response?.data?.message);

}

};

return(

<div className="auth-container">

<div className="auth-right">

<form className="auth-form" onSubmit={submit}>

<h2>Reset Password</h2>

<input name="email" placeholder="Email" onChange={handleChange}/>

<input name="otp" placeholder="OTP" onChange={handleChange}/>

<input
type="password"
name="newPassword"
placeholder="New Password"
onChange={handleChange}
/>

<button className="primary-btn">

Change Password

</button>

</form>

</div>

</div>

);

}

export default ChangePassword;
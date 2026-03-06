import { useState } from "react"
import { signupUser } from "../../services/authService"

function Signup(){

const [form,setForm] = useState({
name:"",
email:"",
password:""
})

const [loading,setLoading] = useState(false)

const handleChange = (e)=>{

setForm({
...form,
[e.target.name]:e.target.value
})

}

const handleSubmit = async(e)=>{

e.preventDefault()

setLoading(true)

await signupUser(form)

setLoading(false)

}

return(

<div className="auth-wrapper">

<div className="auth-card">

<h3 className="text-center mb-4">Create Account</h3>

<form onSubmit={handleSubmit}>

<div className="form-floating mb-3">

<input
type="text"
name="name"
className="form-control"
placeholder="Name"
onChange={handleChange}
/>

<label>Full Name</label>

</div>

<div className="form-floating mb-3">

<input
type="email"
name="email"
className="form-control"
placeholder="Email"
onChange={handleChange}
/>

<label>Email</label>

</div>

<div className="form-floating mb-3">

<input
type="password"
name="password"
className="form-control"
placeholder="Password"
onChange={handleChange}
autoComplete="new-password"
/>

<label>Password</label>

</div>

<button className="btn btn-primary w-100">

{loading ? "Creating..." : "Create Account"}

</button>

</form>

</div>

</div>

)

}

export default Signup
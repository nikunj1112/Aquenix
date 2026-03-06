import { useState } from "react"
import { loginUser } from "../../services/authService"

function Login(){

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [showPassword,setShowPassword] = useState(false)
const [loading,setLoading] = useState(false)

const handleSubmit = async(e)=>{

e.preventDefault()

setLoading(true)

await loginUser({email,password})

setLoading(false)

}

return(

<div className="auth-wrapper">

<div className="auth-card">

<h3 className="text-center mb-4">Welcome Back</h3>

<form onSubmit={handleSubmit}>

<div className="form-floating mb-3">

<input
type="email"
className="form-control"
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
autoComplete="email"
/>

<label>Email</label>

</div>

<div className="form-floating mb-3 position-relative">

<input
type={showPassword ? "text" : "password"}
className="form-control"
placeholder="Password"
autoComplete="current-password"
onChange={(e)=>setPassword(e.target.value)}
/>

<label>Password</label>

<span
className="password-toggle"
onClick={()=>setShowPassword(!showPassword)}
>

{showPassword ? "🙈":"👁"}

</span>

</div>

<button className="btn btn-primary w-100">

{loading ? "Logging in..." : "Login"}

</button>

</form>

</div>

</div>

)

}

export default Login
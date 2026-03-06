import { useAuth } from "../context/AuthContext";

function Navbar(){

const {user,logout} = useAuth();

return(

<div className="navbar">

<h2>AQUENIX</h2>

<div className="nav-right">

<p>{user?.email}</p>

<button onClick={logout}>Logout</button>

</div>

</div>

);

}

export default Navbar;
import { useEffect, useState } from "react";
import {
  getAllUsers,
  addUser,
  deleteUser
} from "../../services/userService";

function Employees(){

const [users,setUsers] = useState([]);

const [form,setForm] = useState({
name:"",
email:""
});

const loadUsers = async ()=>{

const res = await getAllUsers();

setUsers(res.data.data);

};

useEffect(()=>{

loadUsers();

},[]);

const handleChange=(e)=>{

setForm({
...form,
[e.target.name]:e.target.value
});

};

const addEmployee = async(e)=>{

e.preventDefault();

await addUser(form);

setForm({name:"",email:""});

loadUsers();

};

const removeUser = async(email)=>{

await deleteUser(email);

loadUsers();

};

return(

<div>

<h2>Employees</h2>

<form onSubmit={addEmployee} className="employee-form">

<input
name="name"
placeholder="Employee Name"
onChange={handleChange}
/>

<input
name="email"
placeholder="Employee Email"
onChange={handleChange}
/>

<button>Add Employee</button>

</form>

<table className="data-table">

<thead>

<tr>

<th>Name</th>
<th>Email</th>
<th>Action</th>

</tr>

</thead>

<tbody>

{users.map((u)=>(

<tr key={u._id}>

<td>{u.name}</td>

<td>{u.email}</td>

<td>

<button
className="delete-btn"
onClick={()=>removeUser(u.email)}
>

Delete

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

);

}

export default Employees;
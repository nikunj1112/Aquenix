import { useState } from "react";

function Orders(){

const [orders] = useState([
{
id:"ORD001",
customer:"Rahul",
status:"Pending"
},
{
id:"ORD002",
customer:"Amit",
status:"Delivered"
}
]);

return(

<div>

<h2>Orders Management</h2>

<table className="data-table">

<thead>

<tr>

<th>Order ID</th>
<th>Customer</th>
<th>Status</th>

</tr>

</thead>

<tbody>

{orders.map((o)=>(

<tr key={o.id}>

<td>{o.id}</td>

<td>{o.customer}</td>

<td>{o.status}</td>

</tr>

))}

</tbody>

</table>

</div>

);

}

export default Orders;
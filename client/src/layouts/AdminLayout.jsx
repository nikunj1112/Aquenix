import Sidebar from "../components/Sidebar";

function AdminLayout({children}){

return(

<div className="admin-layout">

<Sidebar/>

<div className="admin-content">

{children}

</div>

</div>

);

}

export default AdminLayout;
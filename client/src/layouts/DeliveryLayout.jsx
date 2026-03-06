import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function DeliveryLayout({children}){

return(

<div className="admin-layout">

<Sidebar/>

<div className="admin-content">

<Navbar/>

<div className="page-content">

{children}

</div>

<Footer/>

</div>

</div>

);

}

export default DeliveryLayout;
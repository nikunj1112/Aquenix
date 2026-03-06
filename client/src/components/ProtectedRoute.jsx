// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// function ProtectedRoute({children}){

//   const {user,loading} = useContext(AuthContext);

//   if(loading) return <p>Loading...</p>;

//   if(!user){
//     return <Navigate to="/login"/>
//   }

//   return children;

// }

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {

const { user, loading } = useAuth();

if (loading) {

return <p>Loading...</p>;

}

if (!user) {

return <Navigate to="/login" />;

}

if (role && user.role !== role) {

if (user.role === "admin") {

return <Navigate to="/admin/dashboard" />;

}

if (user.role === "delivery") {

return <Navigate to="/delivery/dashboard" />;

}

}

return children;

}

export default ProtectedRoute;
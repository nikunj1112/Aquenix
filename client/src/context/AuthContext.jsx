// import { createContext, useEffect, useState } from "react";
// import { checkLogin } from "../services/authService";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {

//   const [user,setUser] = useState(null);
//   const [loading,setLoading] = useState(true);

//   const loadUser = async () => {
//     try {

//       const res = await checkLogin();

//       if(res.data.loggedIn){
//         setUser(res.data.user);
//       }

//     } catch(err){
//       console.log(err);
//     }

//     setLoading(false);
//   };

//   useEffect(()=>{
//     loadUser();
//   },[]);

//   return(
//     <AuthContext.Provider value={{user,setUser,loading}}>
//       {children}
//     </AuthContext.Provider>
//   );

// };


import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/db.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

const checkLogin = async () => {

try {

const res = await api.get("/auth/check-login");

if (res.data.loggedIn) {

setUser(res.data.user);

}

} catch (error) {

setUser(null);

}

setLoading(false);

};

useEffect(() => {

checkLogin();

}, []);

const logout = async () => {

await api.post("/auth/logout");

setUser(null);

};

return (

<AuthContext.Provider value={{ user, setUser, logout, loading }}>

{children}

</AuthContext.Provider>

);

};

export const useAuth = () => useContext(AuthContext);
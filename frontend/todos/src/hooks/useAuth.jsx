// useAuth.jsx
import { useContext } from "react";
import { AuthContext } from "../utils/AuthProvider.jsx";

const useAuth = () => {
   const token = useContext(AuthContext);

   if (token === undefined) {
       throw new Error("useAuth must be used within an AuthProvider");
   }

   return token;
};

export default useAuth;
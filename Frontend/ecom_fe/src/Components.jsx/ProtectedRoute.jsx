import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({element ,adminOnly= false}) => {
    const {isAuthenticated,loading, user}= useSelector((state)=>state.user);
    if(loading){
        return <p>loading...</p>
    }
    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }
    if(adminOnly && user.role!=="admin"){
        return <Navigate to="/"/>
    }
  return element;
}

export default ProtectedRoute
import { Outlet } from "react-router-dom";
// import ManagerHeader from "./ManagerHeader";
import ManagerFooter from "./ManagerFooter";
import RoleNavbar from "../Components/RoleNavbar";

export default function ManagerMaster(){
    return(
        <>
        <RoleNavbar />
        <Outlet/>
        <ManagerFooter/>
        </>
    )
}
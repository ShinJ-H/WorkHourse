import { Outlet } from "react-router-dom";
// import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import RoleNavbar from "../Components/RoleNavbar";

export default function AdminMaster(){
    return(
        <>
        <RoleNavbar />
        <Outlet/>
        <AdminFooter/>
        </>
    )
}
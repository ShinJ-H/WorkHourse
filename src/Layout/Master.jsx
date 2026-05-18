import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import RoleNavbar from "../Components/RoleNavbar";

export default function Master(){
    return(
        <>
        <RoleNavbar />
        <Outlet/>
        <Footer/>
        </>
    )
}
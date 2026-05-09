import { Outlet } from "react-router-dom";
import ManagerHeader from "./ManagerHeader";
import ManagerFooter from "./ManagerFooter";

export default function ManagerMaster(){
    return(
        <>
        <ManagerHeader/>
        <Outlet/>
        <ManagerFooter/>
        </>
    )
}
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Master(){
    return(
        <>
        <Header/>
        <Outlet/>
        <Footer/>
        </>
    )
}
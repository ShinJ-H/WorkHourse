import axios from "axios";
import { useEffect, useState } from "react";
import {
useNavigate,
useParams
}
from "react-router-dom";

export default function EditUser() {

   const { id } = useParams();

   const nav = useNavigate();

   const [formData, setFormData] = useState({
      name: "",
      email: "",
      role: "User",
   });

   // Fetch single user
   useEffect(() => {

      const fetchUser = async () => {

         const res = await axios.get(
            "http://localhost:5000/api/users"
         );

         const user = res.data.find(
            (u) => u._id === id
         );

         setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
         });

      };

      fetchUser();

   }, [id]);

   // Change input
   const handleChange = (e) => {

      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });

   };

   // Update user
   // Update user
const handleSubmit = async (e) => {

   e.preventDefault();

   try {

      const res = await axios.put(
         `http://localhost:5000/api/users/update/${id}`,
         formData
      );

      const updatedUser = res.data;

      // logged in user
      const currentUser = JSON.parse(
         localStorage.getItem("user")
      );

      // if own account updated
      if (currentUser && currentUser._id === updatedUser._id) {

         // store same structure as login
         const newUser = {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
         };

         localStorage.setItem(
            "user",
            JSON.stringify(newUser)
         );

         // IMPORTANT: navigate immediately based on the updated role (after 1s)
         setTimeout(() => {
            if (updatedUser.role === "Admin") {
               nav("/admin");
            } else if (updatedUser.role === "Manager") {
               nav("/manager");
            } else {
               nav("/");
            }
         }, 1000);

      } else {
         // Also navigate after 1s when changing role for any other user
         setTimeout(() => {
            if (updatedUser.role === "Admin") {
               nav("/admin");
            } else if (updatedUser.role === "Manager") {
               nav("/manager");
            } else {
               nav("/" );
            }
         }, 1000);
      }

   }
   catch (error) {


      console.log(error);

   }

};

   return (

      <div className="container py-5">

         <h1 className="mb-4">
            Update User
         </h1>

         <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="mb-3">

               <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
               />

            </div>

            {/* EMAIL */}
            <div className="mb-3">

               <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
               />

            </div>

            {/* ROLE */}
            <div className="mb-3">

               <select
                  name="role"
                  className="form-control"
                  value={formData.role}
                  onChange={handleChange}
               >

                  <option value="User">
                     User
                  </option>

                  <option value="Manager">
                     Manager
                  </option>

                  <option value="Admin">
                     Admin
                  </option>

               </select>

            </div>

            <button className="btn btn-primary">

               Update User

            </button>

         </form>

      </div>

   );

}
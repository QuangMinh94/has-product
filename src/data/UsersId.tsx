import axios from "axios";
import { Tasks } from "./database/Tasks";
import { Users } from "./database/Users";

const GetUserId= async(serviceUrl:string,username:string) => {
    let output : Users = {}
    await axios.post(serviceUrl,{
        username : username
      })
       .then(res => {
        if(res.data !== ""){
        output = JSON.parse(JSON.stringify(res.data));
        }
        return output._id;
       })
       .catch(function(error){
           console.log(error);
           
       })
    
    return output._id;
}

export {GetUserId};
import axios from "axios";
import { Users } from "./database/Users";

const GetAllUsers= async(serviceUrl:string) => {
   let output : Users[] = []
   await axios.get(serviceUrl)
    .then(res => {
      output = JSON.parse(JSON.stringify(res.data))
    })
    return output;
}

export default GetAllUsers;
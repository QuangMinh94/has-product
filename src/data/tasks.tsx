import axios from "axios";

const GetAllTasks= async(serviceUrl:string) => {
   await axios.get(serviceUrl)
    .then(res => {
      const data = res.data;
      return data;
    })
}

const GetTasks = async(serviceUrl:string,userId:number,userTitle:string) => {
  let url="";
  await axios.post(serviceUrl,{
   userid : userId,
   usertitle:userTitle
  })
   .then(res => {
     const data = res.data;
     url = data
   })
   .catch(function(error){
       console.log(error);
       
   })
   return url;
}

export {GetTasks,GetAllTasks};
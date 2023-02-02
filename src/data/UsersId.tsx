import axios from 'axios'
import { Users } from './database/Users'

const GetUserId = async (serviceUrl: string, username: string) => {
  let output: Users = {}
  await axios
    .post(serviceUrl, {
      username: username,
    })
    .then((res) => {
      output = JSON.parse(JSON.stringify(res.data))
      return output
    })
    .catch((error) => {
      //console.log('We have an error ' + JSON.stringify(error.response.data))
      output.message = error.response.data.message
      output.code = error.response.data.code
      //console.log(JSON.stringify(Promise.reject(error)))
    })

  return output
}

export { GetUserId }

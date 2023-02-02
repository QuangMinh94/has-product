import { getCookie } from 'typescript-cookie'
import { Role } from '../data/database/Role'
import { Status } from '../data/entity/Status'

const LOGIN_ERROR = 'Sai tên đăng nhập hoặc mật khẩu'
const LOGIN_SERVICE_ERROR = 'Xảy ra lỗi hệ thống, xin vui lòng thử lại sau'
const UPDATE_SUCCESS = 'Update thành công'
const UPDATE_FAIL = 'Update thất bại'
function IGNORE_STT_DEFAULT() {
  let ignoreStt: Status[] = [
    {
      id: 1,
    },
    {
      id: 4,
    },
  ]

  const role: Role = JSON.parse(getCookie('userInfo') as string).Role
  if (role.Level >= 5) {
    ignoreStt.push({
      id: 6,
    })
  }
  return ignoreStt
}
export {
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  LOGIN_ERROR,
  LOGIN_SERVICE_ERROR,
  IGNORE_STT_DEFAULT,
}

import { getCookie } from 'typescript-cookie'
import { Role } from '../data/database/Role'
import { Status } from '../data/interface/Status'

//Component mode
export const UPDATE_MODE = 'UPDATE'
export const INSERT_MODE = 'INSERT'

//status
export const DEFAULT_STT = 'In progress'

//Login text
export const LOGIN_ERROR = 'Sai tên đăng nhập hoặc mật khẩu'
export const LOGIN_SERVICE_ERROR =
  'Xảy ra lỗi hệ thống, xin vui lòng thử lại sau'
export const UPDATE_SUCCESS = 'Update thành công'
export const UPDATE_FAIL = 'Update thất bại'

//ignore status
export function IGNORE_STT_DEFAULT() {
  let ignoreStt: Status[] = [
    {
      id: 1,
    },
    {
      id: 4,
    },
  ]

  /* const role: Role = JSON.parse(getCookie('userInfo') as string).Role
  if (role.Level >= 5) {
    ignoreStt.push(
      {
        id: 6,
      },
      {
        id: 5,
      },
    )
  } */
  return ignoreStt
}

//etc
export const SHOW = 'show'
export const HIDE = 'hide'
export const READONLY = 'readonly'
export const DEFAULT_PASS_SCORE = 10
export const DEFAULT_NOTPASS_SCORE = 0
export const MIN_SCORE = 0
export const MAX_SCORE = 15
export const ZERO_SCORE_TEXT = 'Every effort counts'
export const BAD_SCORE_TEXT = 'You need to make more effort'
export const GOOD_SCORE_TEXT = 'Keep up good work'
export const BIG_SCORE_TEXT = 'Great effort'

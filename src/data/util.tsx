import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faSquare } from '@fortawesome/free-solid-svg-icons'
import { statusData } from './statusData'
import priority from './priority'
import { useState } from 'react'

interface Tasks {
  type: string
  text: string
}

const FindIcon: React.FC<Tasks> = ({ type, text }) => {
  const [typeIcon, setTypeIcon] = useState('')
  const [typeColor, setTypeColor] = useState('')
  let color = ''
  if (type === 'Priority') {
    priority.filter((obj) => {
      if (obj.name.toUpperCase() === text.toUpperCase()) {
        color = obj.color
      }
    })
    return (
      <>
        <FontAwesomeIcon icon={faFlag} color={color} />
      </>
    )
  } else {
    statusData.filter((obj) => {
      if (obj.name.toUpperCase() === text.toUpperCase()) {
        color = obj.color
      }
    })
    return (
      <>
        <FontAwesomeIcon icon={faSquare} color={color} />
      </>
    )
  }
}

export default FindIcon

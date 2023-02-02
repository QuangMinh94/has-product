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
        if (
          text.toUpperCase() === 'To do'.toUpperCase() ||
          text.toUpperCase() === 'pending'.toUpperCase()
        ) {
          color = '#93C5FD'
        } else if (text.toUpperCase() === 'Close'.toUpperCase()) {
          color = '#14B8A6'
        } else if (text.toUpperCase() === 'In review'.toUpperCase()) {
          color = '#A855F7'
        } else {
          color = obj.color
        }
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

import React, { useEffect, useState } from 'react'
import { Space, Switch, Tooltip, Typography } from 'antd'
import '../assets/css/paragraph.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup, faLink } from '@fortawesome/free-solid-svg-icons'
import { Tasks } from '../data/database/Tasks'
interface Name {
  name: string
  task: Tasks
}

const { Paragraph, Text } = Typography

const ParagraphExample: React.FC<Name> = ({ name, task }) => {
  const [ellipsis, setEllipsis] = useState(true)
  const [expand, setExpand] = useState(false)
  const [counter, setCounter] = useState(0)

  const TypoExpand = () => {
    setExpand(true)
    setCounter(!expand ? counter + 0 : counter + 1)
    return null
  }
  const TypoClose = () => {
    setExpand(false)
    setCounter(!expand ? counter + 0 : counter + 1)
    return null
  }

  return (
    <>
      <div key={counter}>
        <Space direction="horizontal">
          <Tooltip title={name} placement="right">
            <Paragraph
              ellipsis={
                ellipsis
                  ? {
                      rows: 1,
                      expandable: false,
                      symbol: '...',
                      onExpand: () => TypoExpand(),
                    }
                  : false
              }
              style={{ margin: '0' }}
            >
              {name}
            </Paragraph>
          </Tooltip>

          {task && task.Subtask && task.Subtask?.length && (
            <FontAwesomeIcon icon={faLink} />
          )}
        </Space>
      </div>
      {expand === true && <a onClick={TypoClose}>Close</a>}
    </>
  )
}

export default ParagraphExample

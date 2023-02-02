import React, { memo, useEffect, useState } from 'react'
import { Button, MenuProps, Spin, notification } from 'antd'
import { Dropdown, Space } from 'antd'
import FindIcon from '../data/util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faSquare } from '@fortawesome/free-solid-svg-icons'
import { statusData } from '../data/statusData'
import { InputTasks } from '../data/database/InputTasks'
import { UpdateTask } from '../data/tasks'
import { UPDATE_FAIL, UPDATE_SUCCESS } from '../util/ConfigText'
import { Status } from '../data/entity/Status'

interface Type {
  type: string
  text: string
  button?: boolean
  id?: string
  taskId?: string
  ignoreStt?: Status[]
}

const DropdownProps: React.FC<Type> = ({
  type,
  text,
  button,
  id,
  taskId,
  ignoreStt,
}) => {
  let items: MenuProps['items'] = []
  const [loading, setLoading] = useState(false)

  if (button === undefined) {
    button = true
  }
  const [txt, setTxt] = useState(text)
  useEffect(() => {
    setTxt(text)
  }, [text])

  function updateService(inputTask: InputTasks) {
    if (taskId !== undefined) {
      setLoading(true)
      UpdateTask('/api/task/' + taskId, inputTask)
        .then((r) => {
          /*  notification.open({
            message: 'Notification',
            description: UPDATE_SUCCESS,
            duration: 2,
            onClick: () => {
              //console.log('Notification Clicked!')
            },
          }) */
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          notification.open({
            message: 'Notification',
            description: UPDATE_FAIL,
            duration: 2,
            onClick: () => {
              //console.log('Notification Clicked!')
            },
          })
        })
    }
  }

  function getPriorityValue(value: string) {
    setTxt(value)
    sessionStorage.setItem('priority' + id, value)
    //call update service
    const inputTask: InputTasks = {
      Priority: value,
    }
    updateService(inputTask)

    //console.log('Priority :' + sessionStorage.getItem('priority'))
  }

  function getStatusValue(value: string) {
    setTxt(value)
    sessionStorage.setItem('status' + id, value)
    //call update service
    const inputTask: InputTasks = {
      Status: value,
    }

    updateService(inputTask)
    //console.log('Status :' + sessionStorage.getItem('status'))
  }

  const priority: MenuProps['items'] = [
    {
      label: (
        <>
          <Space size="small" align="center">
            <FontAwesomeIcon icon={faFlag} color="#F43F5E" />
            <h4>Urgent</h4>
          </Space>
        </>
      ),
      key: 'Urgent',
      onClick: (e) => getPriorityValue(e.key),
    },
    {
      type: 'divider',
    },
    {
      label: (
        <>
          <Space size="small" align="center">
            <FontAwesomeIcon icon={faFlag} color="#FACC15" />
            <h4>High</h4>
          </Space>
        </>
      ),
      key: 'High',
      onClick: (e) => getPriorityValue(e.key),
    },
    {
      type: 'divider',
    },
    {
      label: (
        <>
          <Space size="small" align="center">
            <FontAwesomeIcon icon={faFlag} color="#2DD4BF" />
            <h4>Medium</h4>
          </Space>
        </>
      ),
      key: 'Medium',
      onClick: (e) => getPriorityValue(e.key),
    },
    {
      type: 'divider',
    },
    {
      label: (
        <>
          <Space size="small" align="center">
            <FontAwesomeIcon icon={faFlag} color="#4B5563" />
            <h4>Low</h4>
          </Space>
        </>
      ),
      key: 'Low',
      onClick: (e) => getPriorityValue(e.key),
    },
  ]

  const status: MenuProps['items'] = [
    {
      label: (
        <>
          <Space>
            <FontAwesomeIcon icon={faSquare} color={statusData[0].color} />
            <h4>{statusData[0].name}</h4>
          </Space>
        </>
      ),
      key: statusData[0].name,
      onClick: (e) => getStatusValue(e.key),
    },
    {
      type: 'divider',
    },
    {
      label: (
        <>
          <Space>
            <FontAwesomeIcon icon={faSquare} color={statusData[1].color} />
            <h4>{statusData[1].name}</h4>
          </Space>
        </>
      ),
      key: statusData[1].name,
      onClick: (e) => getStatusValue(e.key),
    },
    {
      type: 'divider',
    },
    {
      label: (
        <>
          <Space>
            <FontAwesomeIcon icon={faSquare} color={statusData[2].color} />
            <h4>{statusData[2].name}</h4>
          </Space>
        </>
      ),
      key: statusData[2].name,
      onClick: (e) => getStatusValue(e.key),
    },
    {
      type: 'divider',
    },
    {
      label: (
        <>
          <Space>
            <FontAwesomeIcon icon={faSquare} color={statusData[3].color} />
            <h4>{statusData[3].name}</h4>
          </Space>
        </>
      ),
      key: statusData[3].name,
      onClick: (e) => getStatusValue(e.key),
    },
    {
      type: 'divider',
    },
    {
      label: (
        <>
          <Space>
            <FontAwesomeIcon icon={faSquare} color={statusData[4].color} />
            <h4>{statusData[4].name}</h4>
          </Space>
        </>
      ),
      key: statusData[4].name,
      onClick: (e) => getStatusValue(e.key),
    },
    {
      type: 'divider',
    },
    {
      label: (
        <>
          <Space>
            <FontAwesomeIcon icon={faSquare} color={statusData[5].color} />
            <h4>{statusData[5].name}</h4>
          </Space>
        </>
      ),
      key: statusData[5].name,
      onClick: (e) => getStatusValue(e.key),
    },
  ]

  if (type === 'Priority') {
    items = priority
  } else {
    if (ignoreStt !== undefined) {
      const r = statusData.filter(
        (elem) => !ignoreStt.find(({ id }) => elem.id === id),
      )
      //statusFilter = statusData.filter((value) => ignoreStt.find({id} => values.id !== id))

      r.map((element) => {
        items?.push(
          {
            label: (
              <>
                <Space>
                  <FontAwesomeIcon icon={faSquare} color={element.color} />
                  <h4>{element.name}</h4>
                </Space>
              </>
            ),
            key: element.name,
            onClick: (e) => getStatusValue(e.key),
          },
          {
            type: 'divider',
          },
        )
      })
      //items = status
    } else {
      items = status
    }
  }

  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      onOpenChange={(e) => console.log}
    >
      <a onClick={(e) => e.preventDefault()}>
        {loading === false ? (
          <Space>
            {button === true ? (
              <Button shape="circle">
                <FindIcon type={type} text={txt} />
              </Button>
            ) : (
              <FindIcon type={type} text={txt} />
            )}
          </Space>
        ) : (
          <Space>
            <Spin size="small" />
          </Space>
        )}
      </a>
    </Dropdown>
  )
}

export default DropdownProps

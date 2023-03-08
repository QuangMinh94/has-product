import { Col, Input, Row, Space } from 'antd'
import ObjectID from 'bson-objectid'
import React, { useEffect, useState } from 'react'
import { CommentRequest, CommentResponse } from '../data/database/Comment'
import { Users } from '../data/database/Users'
import { useAppSelector } from '../redux/app/hook'
import DateFormatter from '../util/DateFormatter'
import UserIcon from './UserIcon'

interface CompInput {
  user: Users
  comment: string
  createdDate: Date
}

interface CommnentsInput {
  userComments: CommentResponse[]
}

const Comp: React.FC<CompInput> = ({ user, comment, createdDate }) => {
  return (
    <Row gutter={10}>
      <Col span={3}>
        <UserIcon
          username={user.UserName}
          userColor={user.Color}
          tooltipName={user.UserName}
          userInfo={user}
        />
      </Col>
      <Col span={21}>
        <Space
          direction="vertical"
          style={{
            width: '100%',
            borderColor: '#FACC15',
            backgroundColor: '#F3F4F6',
          }}
        >
          <div>
            <p style={{ float: 'left', width: 'auto' }}>{user.UserName}</p>
            <p style={{ float: 'right', width: 'auto' }}>
              <DateFormatter dateString={createdDate} />
            </p>
          </div>
          <p style={{ float: 'left', width: 'auto' }}>{comment}</p>
        </Space>
      </Col>
    </Row>
  )
}

const Comments: React.FC<CommnentsInput> = ({ userComments }) => {
  const [dummyInput, setDummyInput] = useState<CommentResponse[]>(
    JSON.parse(
      '[\r\n\t{\r\n\t\t"_id": "63f34a635eb52eb76bcf0431",\r\n\t\t"Comment": "Comment 203xxxxxxxxxxxxxxxxx",\r\n\t\t"UserId": "63f2e8d13a22b6c677fd32d5",\r\n\t\t"CreatedDate": "2004-12-21T03:23:54.000Z",\r\n\t\t"Attachment": [],\r\n\t\t"__v": 0\r\n\t},\r\n\t{\r\n\t\t"_id": "63f472e3058151cd4d802e23",\r\n\t\t"Comment": "999-000-111",\r\n\t\t"UserId": "63f32f80dadfa1087cc1fe8a",\r\n\t\t"CreatedDate": "2004-12-21T03:23:54.000Z",\r\n\t\t"Attachment": [],\r\n\t\t"__v": 0\r\n\t},\r\n\t{\r\n\t\t"_id": "63f47bc8686cdc71fcaa3ab7",\r\n\t\t"Comment": "999-000-111",\r\n\t\t"UserId": "63f32f80dadfa1087cc1fe8a",\r\n\t\t"CreatedDate": "2004-12-21T03:23:54.000Z",\r\n\t\t"Attachment": [],\r\n\t\t"__v": 0\r\n\t},\r\n\t{\r\n\t\t"_id": "63f47c8f686cdc71fcaa3ab9",\r\n\t\t"Comment": "9xin ch\u00E0o 1",\r\n\t\t"UserId": "63f32f80dadfa1087cc1fe8a",\r\n\t\t"CreatedDate": "2004-12-21T03:23:54.000Z",\r\n\t\t"Attachment": [],\r\n\t\t"__v": 0\r\n\t},\r\n\t{\r\n\t\t"_id": "63f48d28686cdc71fcaa3abc",\r\n\t\t"Comment": "DatPT \u0111\u1EA9y d\u1EEF li\u1EC7u comment",\r\n\t\t"UserId": "63e36b9b4d00c6533caf13fc",\r\n\t\t"CreatedDate": "1004-12-21T03:23:54.000Z",\r\n\t\t"Attachment": [],\r\n\t\t"__v": 0\r\n\t},\r\n\t{\r\n\t\t"_id": "63f48e91686cdc71fcaa3abe",\r\n\t\t"Comment": "1",\r\n\t\t"UserId": "63e36b9b4d00c6533caf13fc",\r\n\t\t"CreatedDate": "1004-12-21T03:23:54.000Z",\r\n\t\t"Attachment": [],\r\n\t\t"__v": 0\r\n\t},\r\n\t{\r\n\t\t"_id": "63f48e91686cdc71fcaa3abe",\r\n\t\t"Comment": "2",\r\n\t\t"UserId": "63e36b9b4d00c6533caf13fc",\r\n\t\t"CreatedDate": "1004-12-21T03:23:54.000Z",\r\n\t\t"Attachment": [],\r\n\t\t"__v": 0\r\n\t},\r\n\t{\r\n\t\t"_id": "63f48e91686cdc71fcaa3abe",\r\n\t\t"Comment": "3",\r\n\t\t"UserId": "63e36b9b4d00c6533caf13fc",\r\n\t\t"CreatedDate": "1004-12-21T03:23:54.000Z",\r\n\t\t"Attachment": [],\r\n\t\t"__v": 0\r\n\t}\r\n]',
    ),
  )

  const user = useAppSelector((state) => state.userInfo.user)
  const [commentInput, setCommentInput] = useState('')

  const AddComp = () => {
    if (commentInput !== '') {
      const newId = ObjectID().toHexString()
      setDummyInput([
        ...dummyInput,
        {
          _id: newId,
          Comment: commentInput,
          UserId: '63e36b9b4d00c6533caf13fc',
          CreatedDate: new Date(),
          Attachment: [],
          __v: 0,
        },
      ])
      setCommentInput('')
    }
  }

  return (
    <div>
      <Space
        direction="vertical"
        style={{
          width: '100%',
          height: '300px',
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
      >
        {user &&
          dummyInput.map((element) => (
            <Comp
              user={user}
              comment={element.Comment}
              createdDate={new Date()}
              key={element._id}
            />
          ))}
      </Space>

      <Input
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        onPressEnter={() => {
          AddComp()
        }}
      ></Input>
    </div>
  )
}

export default Comments

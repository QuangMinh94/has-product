import '../assets/css/index.css'
import React, { useState } from 'react'
import ScoreRanking from '../components/ScoreRanking'
import PersonalScore from '../components/PersonalScore'
import { Button, Layout, Space } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'

const { Content } = Layout

const Dashboard: React.FC = () => {
  return (
    <>
      <Content className="inner-content">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ float: 'right', width: '10%' }}>
            <Button type="primary">
              <Space direction="horizontal">
                <FontAwesomeIcon icon={faRefresh} />
                <div style={{ marginRight: '1px' }}>Refresh</div>
              </Space>
            </Button>
          </div>
          <ScoreRanking />
          <PersonalScore />
        </Space>
      </Content>
    </>
  )
}

export default Dashboard

import React, { useState } from 'react';
import { Switch, Tooltip, Typography } from 'antd';

interface Name{
    name:string;
}

const { Paragraph, Text } = Typography;

const ParagraphExample: React.FC<Name> = ({name}) => {
  const [ellipsis, setEllipsis] = useState(true);
  const [expand, setExpand] = useState(false);
  const [counter, setCounter] = useState(0);


 const TypoExpand = () => {   
      setExpand(true);
      setCounter(!expand ? counter + 0 : counter + 1) ;
      return (null);
  };
  const TypoClose = () => {    
    setExpand(false);
    setCounter(!expand ? counter + 0 : counter + 1) ;
    return (null);
};
    
  ;

  return (
    <>
 <div key={counter}>
 <Tooltip title={name} placement="right">
      <Paragraph ellipsis={ellipsis ? { rows: 1, expandable: false, symbol: '...' ,onExpand: (() =>TypoExpand())} : false} style={{margin:'0'}}>
        {name}
      </Paragraph>
      </Tooltip>
      </div>
      {expand === true && <a onClick={TypoClose}>Close</a>}
    </>
  );
};

export default ParagraphExample;
import {
    Box,
    Flex,
    Heading,
  } from '@chakra-ui/react';
  import { Dispatch, SetStateAction, useEffect, useState } from 'react';
  import { PolyglotNodeValidation } from '../../types/polyglotElements';
  type WatchVideoToolProps = {
    isOpen: boolean;
    actualActivity: PolyglotNodeValidation | undefined;
    unlock: Dispatch<SetStateAction<boolean>>;
    setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
  };
  
  type WatchVideoData = { 
    link: string;
  };
  
  const WatchVideoTool = ({
    isOpen,
    actualActivity,
    unlock,
    setSatisfiedConditions
  }: WatchVideoToolProps) => {
    if(!isOpen)
      return (<></>);
    console.log('data check ' + actualActivity);
    const data = actualActivity?.data || {text: '', link: '' }as WatchVideoData;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!data) return;
      unlock(true);
      const edgesId = actualActivity?.validation.map((edge)=>edge.id);
      if(edgesId!=undefined)
        setSatisfiedConditions(edgesId);
    }, [actualActivity]);
  
    return (
    <Box
      mr="5px"
      width={'80%'}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
          <Heading size={'2xl'}>Watch Video Activity</Heading>
          <Heading size={'md'} paddingTop={'20px'}>Watch the video at the following link</Heading><br/>          
          <Flex paddingTop={'50px'} hidden={!data.link}>
            {data.link}
          </Flex>
      </Box>
  );
  };
  
  export default WatchVideoTool;
  
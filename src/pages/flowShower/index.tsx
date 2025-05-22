/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
//import "../FlowShower.css"; // Ensure this CSS file is updated for new styles
import {
  Box,
  Center,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { registerAnalyticsAction } from '../../data/AnalyticsFunctions';
import {
  OpenLPInfoAction,
  Platform,
  ZoneId,
} from '../../types/polyglotElements';

function FlowShower() {
  const [scriptCheck, setScriptCheck] = useState(false);
  const [userId, setUserId] = useState('guest');

  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://play.workadventu.re/iframe_api.js';
    script.async = true;

    script.onload = () => {
      setScriptCheck(true);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!scriptCheck) return;
    try {
      setUserId(WA.player.uuid || 'guest');
    } catch (e) {
      setUserId('guest');
    }
    const action: OpenLPInfoAction = {
      timestamp: new Date(),
      userId: userId,
      actionType: 'open_LP_info',
      platform: Platform.WorkAdventure,
      zoneId: ZoneId.InstructionWebpageZone,
      action: { flowId: 'none' },
    };

    registerAnalyticsAction(action);

    const handleBeforeUnload = () => {
      const action: OpenLPInfoAction = {
        timestamp: new Date(),
        userId: userId,
        actionType: 'close_LP_info',
        platform: Platform.WorkAdventure,
        zoneId: ZoneId.InstructionWebpageZone,
        action: { flowId: 'none' },
      };

      registerAnalyticsAction(action);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [scriptCheck]);

  return (
    <Center>
      <Box marginTop={'20px'}>
        <Heading as="h1">Welcome in our little educational space</Heading>
        <Box>This world is divided in 5 areas:</Box>
        <UnorderedList>
          <ListItem>
            <Text color={'#5db048'}>"outside"</Text>: where you can rest in our
            quiet zone and the flows menu where you can choose which learning
            path you want to do;
          </ListItem>
          <ListItem>
            <Text color={'#434fbf'}>"Library of Knowledge"</Text>: the reading
            hub where learners can study modules of wisdom and test their
            understanding of the material. Each knowledge has its basis here;
          </ListItem>
          <ListItem>
            <Text color={'#878686'}>"Coding plaza"</Text>: learners go there to
            complete basic and intermediate coding tasks. It focuses on personal
            effort and commitment.
          </ListItem>
          <ListItem>
            <Text color={'#e68c17'}>"Central Workshop"</Text>: where learners
            engage in advanced modeling and design more complex class diagrams.
            This room is required for UML missions.
          </ListItem>
          <ListItem>
            <Text color={'#b322e3'}>"Room Meeting"</Text>: inside this private
            room, it's possible to interact safely with experts or tutors
            receiving the necessary support;
          </ListItem>
        </UnorderedList>
        <Box>
          These are the information of the learning path you have selected, if
          you want to change learning path you can do it from the joystick area
          outside.
        </Box>
      </Box>
    </Center>
  );
}

export default FlowShower;

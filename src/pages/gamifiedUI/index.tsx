/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-restricted-globals */
import { CloseIcon } from '@chakra-ui/icons';
import { Box, IconButton, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import NumberedDisplay from '../../components/GamifiedUI/NumberDisplay';

/*
import { AnalyticsActionBody, GradeAction, Platform, ZoneId } from '../../types/polyglotElements';
import { API } from '../../data/api';

//setup for creation action by UI

function registerAnalyticsAction<T extends AnalyticsActionBody>(
  action: T
): void {
  if ('actionType' in action) {
    switch (action.actionType) {
      case 'gradeAction':
        if (!('flow' in action.action && 'grade' in action.action)) {
          throw new Error('Invalid GradeAction structure');
        }
        break;
        case 'completeLPAction':
          break;
      default:
        throw new Error(`Unknown actionType: ${action.actionType}`);
    }
  }
  API.registerAction(action);
}

const action: GradeAction = {
  timestamp: new Date(),
  userId: WA.player.name,
  actionType: 'GradeAction',
  zoneId: ZoneId.FreeZone,
  platform: Platform.WorkAdventure,
  action: {
    flow: 'test',
    grade: 5,
  },
};
registerAnalyticsAction(action);
*/

function GamifiedUI() {
  const [studyRoomCode, setStudyRoomCode] = useState('');
  const [sectorName, setSectorName] = useState('');
  const [scriptCheck, setScriptCheck] = useState(false);
  const toast = useToast();

  const checkCodeStudyRoom = (code: string) => {
    setStudyRoomCode(code);
    if (!scriptCheck) return;
    WA.player.state.studyRoomCode = code;
  };

  const setCodeStudyRoom = (code: string) => {
    setStudyRoomCode('True');
    WA.state.saveVariable(studyRoomCode, code);
    toast({
      title: 'Validation error',
      description: 'Password correctly registred.',
      status: 'success',
      duration: 3000,
      position: 'top-left',
      isClosable: true,
    });
  };
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
    setStudyRoomCode((WA.player.state.studyRoomCode as string) || '');
    setSectorName((WA.player.state.sectorName as string) || '');
    const studyRoomSub = WA.player.state
      .onVariableChange('studyRoomCode')
      .subscribe((value) => {
        if (value == studyRoomCode) return;
        setStudyRoomCode((value as string) || '');
        if (studyRoomCode == 'Error')
          toast({
            title: 'Code error',
            description:
              'There is no room with a matching code, please try again or enter a room to create your own session.',
            status: 'error',
            duration: 3000,
            position: 'top-left',
            isClosable: true,
          });
        if (studyRoomCode == 'True')
          toast({
            title: 'Validation',
            description: 'Password correctly registred.',
            status: 'success',
            duration: 3000,
            position: 'top-left',
            isClosable: true,
          });
      });
    const sectorNameSub = WA.player.state
      .onVariableChange('sectorName')
      .subscribe((value) => {
        if (value == sectorName) return;
        setStudyRoomCode((value as string) || '');
        console.log('sectorName change on webApp');
        setSectorName((value as string) || '');
      });
    return () => {
      studyRoomSub.unsubscribe();
      sectorNameSub.unsubscribe();
    };
  }, [scriptCheck]);

  return (
    <Box bg="transparent" zIndex="9999">
      <NumberedDisplay
        onEnterAction={checkCodeStudyRoom}
        isOpen={sectorName == 'StudyArea'}
        text={'Enter Code'}
      />
      <NumberedDisplay
        onEnterAction={setCodeStudyRoom}
        isOpen={sectorName.includes('State') && studyRoomCode != 'True'}
        text={'Define Code'}
      />
      <IconButton
        hidden={!sectorName.includes('State') && studyRoomCode != 'True'}
        aria-label="Exit"
        icon={<CloseIcon />}
        onClick={(e) => {
          WA.player.state.studyRoomCode = 'Exit';
          console.log('exit');
        }}
      />
    </Box>
  );
}

export default GamifiedUI;

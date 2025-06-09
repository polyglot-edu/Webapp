// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
import { Box, Button, Center, Flex } from '@chakra-ui/react';
//import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import GymTool from '../../components/ActivityTypes/gym';
import HeadingSubtitle from '../../components/CostumTypography/HeadingSubtitle';
import HeadingTitle from '../../components/CostumTypography/HeadingTitle';
import Navbar from '../../components/NavBars/NavBar';
import { registerAnalyticsAction } from '../../data/AnalyticsFunctions';
import {
  OpenCloseNodeAction,
  OpenCloseTool,
  Platform,
  PolyglotNodeValidation,
  ZoneId,
} from '../../types/polyglotElements';
import auth0 from '../../utils/auth0';

const FlowIndex = () => {
  const [actualData, setActualData] = useState<PolyglotNodeValidation>();
  const [flowId, setFlowId] = useState('');
  const [unlock, setUnlock] = useState(false);
  const [satisfiedConditions, setSatisfiedConditions] = useState<string[]>([]);
  const [showNextButton, setShowNextButton] = useState(false);
  const [scriptCheck, setScriptCheck] = useState(false);
  const [userId, setUserId] = useState('');
  const [lastAction, setAction] = useState('');

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
  }, [scriptCheck]);

  useEffect(() => {
    if (userId != '') {
      //problemi nella creazione delle azioni controlla -> flowShower e FlowMenu sono ok da controllare solo lo stato di WA.player

      setAction('open_tool');
      registerAnalyticsAction({
        timestamp: new Date(),
        userId: userId,
        actionType: 'open_tool',
        zoneId: ZoneId.FreeZone,
        platform: Platform.WorkAdventure,
        action: undefined,
      } as OpenCloseTool);
      setScriptCheck(false); //debug to run only one time

      const handleBeforeUnload = () => {
        registerAnalyticsAction({
          timestamp: new Date(),
          userId: userId,
          actionType: 'close_tool',
          zoneId: ZoneId.FreeZone,
          platform: Platform.WebApp,
          action: undefined,
        } as OpenCloseTool);
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [userId]);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" bg="gray.50">
      {/* if is loading */}
      <Navbar />
      <Box
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={1}
      >
        <Flex
          //spacing={6}
          bg="white"
          p={10}
          shadow="md"
          borderRadius="lg"
          mt="60px"
          mb="60px"
          width={{ base: '90%', md: '80%', lg: '70%' }}
          textAlign="center"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <GymTool
            setUnlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            userId={userId}
            flowId={flowId}
            lastAction={lastAction}
            setLastAction={setAction}
            setShowNextButton={setShowNextButton}
          />
          <Button
            isDisabled={!unlock}
            hidden={
              (unlock && satisfiedConditions[0] == undefined) ||
              actualData?.platform != 'Library' ||
              (!showNextButton && actualData?.type == 'abstractNode')
            }
            title={unlock ? 'Click to continue' : 'Complete the assessment'}
            left={'45%'}
            top={'20px'}
            position={'relative'}
            color={'#0890d3'}
            border={'2px solid'}
            borderColor={'#0890d3'}
            borderRadius={'8px'}
            _hover={{
              transform: 'scale(1.05)',
              transition: 'all 0.2s ease-in-out',
            }}
            _disabled={{
              cursor: 'not-allowed',
              opacity: 0.4,
            }}
            onClick={() => {
              setAction('close_node');
              if (actualData)
                registerAnalyticsAction({
                  timestamp: new Date(),
                  userId: userId,
                  actionType: 'close_node',
                  zoneId: ZoneId.FreeZone,
                  platform: Platform.WebApp,
                  action: {
                    flowId: flowId,
                    nodeId: actualData._id,
                    activity: actualData.type,
                  },
                } as OpenCloseNodeAction);
            }}
          >
            Next
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default FlowIndex;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth0.getSession(ctx.req, ctx.res);

  if (!session) return { props: {} };

  return {
    props: {
      accessToken: session.accessToken,
    },
  };
};

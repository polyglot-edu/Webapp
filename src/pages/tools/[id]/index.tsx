// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Spacer,
  VStack,
} from '@chakra-ui/react';
//import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import CloseEndedTool from '../../../components/ActivityTypes/closeEndedQuestion';
import MultichoiceTool from '../../../components/ActivityTypes/multichoiceQuestion';
import OpenQuestionTool from '../../../components/ActivityTypes/openQuestion';
import ReadMaterialTool from '../../../components/ActivityTypes/readMaterial';
import SummaryTool from '../../../components/ActivityTypes/summary';
import TrueFalseTool from '../../../components/ActivityTypes/trueFalse';
import WatchVideoTool from '../../../components/ActivityTypes/watchVideo';
import Navbar from '../../../components/NavBars/NavBar';
import { registerAnalyticsAction } from '../../../data/AnalyticsFunctions';
import { API } from '../../../data/api';
import {
  OpenCloseTool,
  Platform,
  PolyglotNodeValidation,
  ZoneId,
} from '../../../types/polyglotElements';
import auth0 from '../../../utils/auth0';

const FlowIndex = () => {
  // Calling bootstrapExtra will initiliaze all the "custom properties"
  //bootstrapExtra();
  const [actualData, setActualData] = useState<PolyglotNodeValidation>();
  const [unlock, setUnlock] = useState(false);
  const [satisfiedConditions, setSatisfiedConditions] = useState<string[]>([]);
  const router = useRouter();
  const ctx = router.query?.id?.toString();
  const [showNextButton, setShowNextButton] = useState(false);
  const [scriptCheck, setScriptCheck] = useState(false);
  const [userId, setUserId] = useState('');
  const [flowId, setFlowId] = useState('');

  useEffect(() => {
    if (ctx != undefined)
      API.getActualNodeInfo({ ctxId: ctx }).then((resp) => {
        setActualData(resp.data);
        setUnlock(false);
        setFlowId(resp.data.flowId);
      });
    const script = document.createElement('script');

    script.src = 'https://play.workadventu.re/iframe_api.js';
    script.async = true;

    script.onload = () => {
      setScriptCheck(true);
    };

    document.body.appendChild(script);
    if (ctx != undefined)
      API.getActualNodeInfo({ ctxId: ctx }).then((resp) => {
        setActualData(resp.data);
        setUnlock(false);
      });

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  useEffect(() => {
    if (!scriptCheck) return;
    console.log('script checked');
    try {
      setUserId(WA.player.playerId.toString()||'guest');

    if (userId) {
      console.log('create action');
      API.registerAction({
        timestamp: new Date(),
        userId: userId,
        actionType: 'open_tool',
        zoneId: ZoneId.WebAppZone,
        platform: Platform.WebApp,
        action: undefined,
      }).then((response) => console.log('resposte= ' + response.data));
      setScriptCheck(false); //debug to run only one time
      return () => {
        console.log('create close action');
        API.registerAction({
          timestamp: new Date(),
          userId: userId,
          actionType: 'close_tool',
          zoneId: ZoneId.WebAppZone,
          platform: Platform.WebApp,
          action: undefined,
        }).then((response) => console.log('resposte= ' + response.data));
      };
    }
    } catch (e) {
      console.log(e);
    }
  }, [scriptCheck]);

  useEffect(() => {
    if (actualData) {
      const action: OpenCloseTool = {
        timestamp: new Date(),
        userId: WA.player.name || '',
        actionType: 'openToolAction',
        platform: Platform.WebApp,
        zoneId: ZoneId.WebAppZone,
        action: {
          flowId: actualData._id, //al momento non c'è flowId su PolyglotNodeValidation
          nodeId: actualData._id,
          activity: actualData.type,
        },
      };

      registerAnalyticsAction(action);
    }
    const handleBeforeUnload = () => {
      const action: OpenCloseTool = {
        timestamp: new Date(),
        userId: WA.player.name || '',
        actionType: 'closeToolAction',
        platform: Platform.WorkAdventure,
        zoneId: ZoneId.FreeZone,
        action: {
          flowId: actualData?._id || '', //al momento non c'è flowId su PolyglotNodeValidation
          nodeId: actualData?._id || '',
          activity: actualData?.type || 'wrongType',
        },
      };

      registerAnalyticsAction(action);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [actualData]);

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
          width={{ base: '90%', md: '70%', lg: '60%' }}
          textAlign="center"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <ReadMaterialTool
            isOpen={
              actualData?.type == 'ReadMaterialNode' ||
              actualData?.type == 'lessonTextNode'
            }
            actualActivity={actualData}
            unlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            showNextButton={showNextButton}
            userId={userId}
            flowId={flowId}
          />
          <WatchVideoTool
            isOpen={actualData?.type == 'WatchVideoNode'}
            actualActivity={actualData}
            unlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            userId={userId}
            flowId={flowId}
          />
          <MultichoiceTool
            isOpen={actualData?.type == 'multipleChoiceQuestionNode'}
            actualActivity={actualData}
            unlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            showNextButton={showNextButton}
            setShowNextButton={setShowNextButton}
            userId={userId}
            flowId={flowId}
          />
          <CloseEndedTool
            isOpen={actualData?.type == 'closeEndedQuestionNode'}
            actualActivity={actualData}
            unlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            showNextButton={showNextButton}
            setShowNextButton={setShowNextButton}
            userId={userId}
            flowId={flowId}
          />
          <TrueFalseTool
            isOpen={actualData?.type == 'TrueFalseNode'}
            actualActivity={actualData}
            unlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            showNextButton={showNextButton}
            setShowNextButton={setShowNextButton}
            userId={userId}
            flowId={flowId}
          />
          <OpenQuestionTool
            isOpen={actualData?.type == 'OpenQuestionNode'}
            actualActivity={actualData}
            unlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            showNextButton={showNextButton}
            setShowNextButton={setShowNextButton}
            userId={userId}
            flowId={flowId}
          />
          <SummaryTool
            isOpen={actualData?.type == 'SummaryNode'}
            actualActivity={actualData}
            unlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            showNextButton={showNextButton}
            userId={userId}
            flowId={flowId}
          />
          <Box hidden={actualData?.platform == 'WebApp'}>
            <Center>
              Your next activity is in {actualData?.platform} return to
              WorkAdventu.re map and go to the correct area to access the next
              task.
            </Center>
          </Box>
          <Button
            isDisabled={!unlock}
            hidden={
              (unlock && satisfiedConditions[0] == undefined) ||
              actualData?.platform != 'WebApp' ||
              (!showNextButton &&
                (actualData?.type == 'closeEndedQuestionNode' ||
                  actualData?.type == 'multipleChoiceQuestionNode' ||
                  actualData?.type == 'TrueFalseNode' ||
                  actualData?.type == 'OpenQuestionNode'))
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
              console.log('continue ' + satisfiedConditions);
              if (!ctx) return;
              API.nextNodeProgression({
                ctxId: ctx,
                satisfiedConditions: satisfiedConditions,
              }).then((response) => {
                console.log(response);
                setActualData(response.data);
                setUnlock(false);
                setShowNextButton(false);
                WA.player.state.platform = actualData?.platform;
              });
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

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
import {
  Box,
  Button,
  Center,
  Flex,
} from '@chakra-ui/react';
//import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CloseEndedTool from '../../../components/ActivityTypes/closeEndedQuestion';
import LibraryTool from '../../../components/ActivityTypes/library';
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
  OpenCloseNodeAction,
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
  const [flowId, setFlowId] = useState('');
  const [unlock, setUnlock] = useState(false);
  const [satisfiedConditions, setSatisfiedConditions] = useState<string[]>([]);
  const router = useRouter();
  const ctx = router.query?.id?.toString();
  const [showNextButton, setShowNextButton] = useState(false);
  const [scriptCheck, setScriptCheck] = useState(false);
  const [userId, setUserId] = useState('');
  const [lastAction, setAction] = useState('');

  useEffect(() => {
    if (ctx != undefined)
      API.getActualNodeInfo({ ctxId: ctx }).then((resp) => {
        setFlowId(resp.data.flowId);
        setActualData(resp.data);
        setUnlock(false);
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
        zoneId: ZoneId.WebAppZone,
        platform: Platform.WebApp,
        action: undefined,
      } as OpenCloseTool);
      setScriptCheck(false); //debug to run only one time

      const handleBeforeUnload = () => {
        registerAnalyticsAction({
          timestamp: new Date(),
          userId: userId,
          actionType: 'close_tool',
          zoneId: ZoneId.WebAppZone,
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
            setUnlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            showNextButton={showNextButton}
            userId={userId}
            flowId={flowId}
            lastAction={lastAction}
            setLastAction={setAction}
          />
          <WatchVideoTool
            isOpen={actualData?.type == 'WatchVideoNode'}
            actualActivity={actualData}
            setUnlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            userId={userId}
            flowId={flowId}
            lastAction={lastAction}
            setLastAction={setAction}
          />
          <MultichoiceTool
            isOpen={actualData?.type == 'multipleChoiceQuestionNode'}
            actualActivity={actualData}
            setUnlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            showNextButton={showNextButton}
            setShowNextButton={setShowNextButton}
            userId={userId}
            flowId={flowId}
            lastAction={lastAction}
            setLastAction={setAction}
          />
          <CloseEndedTool
            isOpen={actualData?.type == 'closeEndedQuestionNode'}
            actualActivity={actualData}
            setUnlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            showNextButton={showNextButton}
            setShowNextButton={setShowNextButton}
            userId={userId}
            flowId={flowId}
            lastAction={lastAction}
            setLastAction={setAction}
          />
          <TrueFalseTool
            isOpen={actualData?.type == 'TrueFalseNode'}
            actualActivity={actualData}
            setUnlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            showNextButton={showNextButton}
            setShowNextButton={setShowNextButton}
            userId={userId}
            flowId={flowId}
            lastAction={lastAction}
            setLastAction={setAction}
          />
          <OpenQuestionTool
            isOpen={actualData?.type == 'OpenQuestionNode'}
            actualActivity={actualData}
            setUnlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            showNextButton={showNextButton}
            setShowNextButton={setShowNextButton}
            userId={userId}
            flowId={flowId}
            lastAction={lastAction}
            setLastAction={setAction}
          />
          <SummaryTool
            isOpen={actualData?.type == 'SummaryNode'}
            actualActivity={actualData}
            setUnlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            showNextButton={showNextButton}
            userId={userId}
            flowId={flowId}
            lastAction={lastAction}
            setLastAction={setAction}
          />
          <LibraryTool
            isOpen={actualData?.type == 'abstractNode'}
            actualActivity={actualData}
            setUnlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            showNextButton={showNextButton}
            userId={userId}
            flowId={flowId}
            lastAction={lastAction}
            setLastAction={setAction}
            setShowNextButton={setShowNextButton}
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
              setAction('close_node');
              if (actualData)
                registerAnalyticsAction({
                  timestamp: new Date(),
                  userId: userId,
                  actionType: 'close_node',
                  zoneId: ZoneId.WebAppZone,
                  platform: Platform.WebApp,
                  action: {
                    flowId: flowId,
                    nodeId: actualData._id,
                    activity: actualData.type,
                  },
                } as OpenCloseNodeAction);
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

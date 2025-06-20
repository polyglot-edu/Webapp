// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
import { Box, Button, Center, Flex } from '@chakra-ui/react';
//import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CodingQuestionTool from '../../../components/ActivityTypes/codingQuestion';
import Navbar from '../../../components/NavBars/NavBar';
import { API } from '../../../data/api';
import { PolyglotNodeValidation } from '../../../types/polyglotElements';
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

  useEffect(() => {
    if (ctx != undefined)
      API.getActualNodeInfo({ ctxId: ctx }).then((resp) => {
        setActualData(resp.data);
        setUnlock(false);
      });
    const script = document.createElement('script');

    script.src = 'https://play.workadventu.re/iframe_api.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
          <CodingQuestionTool
            isOpen={actualData?.type == 'codingQuestionNode'}
            actualActivity={actualData}
            unlock={setUnlock}
            setSatisfiedConditions={setSatisfiedConditions}
            setShowNextButton={setShowNextButton}
          />
          <Box hidden={actualData?.platform == 'CodingWebApp'}>
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
              actualData?.platform != 'CodingWebApp' ||
              (!showNextButton && actualData?.type == 'codingQuestionNode')
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

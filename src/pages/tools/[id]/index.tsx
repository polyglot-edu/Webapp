// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
import { ArrowRightIcon, EditIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
//import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import CloseEndedTool from '../../../components/ActivityTypes/closeEndedQuestion';
import MultichoiceTool from '../../../components/ActivityTypes/multichoiceQuestion';
import ReadMaterialTool from '../../../components/ActivityTypes/readMaterial';
import TrueFalseTool from '../../../components/ActivityTypes/trueFalse';
import WatchVideoTool from '../../../components/ActivityTypes/watchVideo';
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
    <>
      {/* if is loading */}
      <Navbar />
      <Box
        mr="5px"
        paddingTop={'10px'}
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
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
        />
        <WatchVideoTool
          isOpen={actualData?.type == 'WatchVideoNode'}
          actualActivity={actualData}
          unlock={setUnlock}
          setSatisfiedConditions={setSatisfiedConditions}
        />
        <MultichoiceTool
          isOpen={actualData?.type == 'multipleChoiceQuestionNode'}
          actualActivity={actualData}
          unlock={setUnlock}
          setSatisfiedConditions={setSatisfiedConditions}
        />
        <CloseEndedTool
          isOpen={actualData?.type == 'closeEndedQuestionNode'}
          actualActivity={actualData}
          unlock={setUnlock}
          setSatisfiedConditions={setSatisfiedConditions}
        />
        <TrueFalseTool
          isOpen={actualData?.type == 'TrueFalseNode'}
          actualActivity={actualData}
          unlock={setUnlock}
          setSatisfiedConditions={setSatisfiedConditions}
        />
      </Box>
      <IconButton
        isDisabled={!unlock}
        hidden={unlock && satisfiedConditions[0] == undefined}
        title={unlock ? 'click to continue' : 'complete the assement'}
        right={'2%'}
        bottom={'0px'}
        position={'absolute'}
        backgroundColor={unlock ? 'lightgreen' : 'red'}
        color={'grey'}
        aria-label="Continue"
        icon={<ArrowRightIcon />}
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
            WA.player.state.platform = actualData?.platform; //update actual platform for workadventure
          });
        }}
      />
    </>
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

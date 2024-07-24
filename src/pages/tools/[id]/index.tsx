import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { API } from '../../../data/api';
import { PolyglotFlow, PolyglotNodeValidation } from '../../../types/polyglotElements';
import auth0 from '../../../utils/auth0';
import Navbar from '../../../components/NavBars/NavBar';
import { BaseButton } from '@fluentui/react';
import { ArrowRightIcon, EditIcon } from '@chakra-ui/icons';
import ReadMaterialTool from '../../../components/ActivityTypes/readMaterial';
import WatchVideoTool from '../../../components/ActivityTypes/watchVideo';
import MultichoiceTool from '../../../components/ActivityTypes/multichoiceQuestion';
import CloseEndedTool from '../../../components/ActivityTypes/closeEndedQuestion';


const FlowIndex = () => {

  const [actualData, setActualData] = useState<PolyglotNodeValidation>();
  const [unlock, setUnlock] = useState(false);
  const [satisfiedConditions, setSatisfiedConditions] = useState<string[]>([]);
  const router = useRouter();
  const ctx = router.query?.id?.toString();
  
  useEffect(() => {
    if(ctx != undefined)
    API.getActualNodeInfo({ctxId: ctx}).then((resp) => {
    setActualData(resp.data);
    setUnlock(false);
    })
  }, []);

  return (
    <>
      {/* if is loading */}
      <Navbar/>
      <Box
        mr="5px"
        paddingTop={'10px'}
        display="flex"
        flexDirection="column"
        justifyContent='flex-start'
        alignItems="center">
        <ReadMaterialTool isOpen={actualData?.type=='ReadMaterialNode' || actualData?.type=='lessonTextNode' } actualActivity={actualData} unlock={setUnlock} setSatisfiedConditions={setSatisfiedConditions}/>
        <WatchVideoTool isOpen={actualData?.type=='WatchVideoNode'} actualActivity={actualData} unlock={setUnlock} setSatisfiedConditions={setSatisfiedConditions}/>
        <MultichoiceTool isOpen={actualData?.type=='multipleChoiceQuestionNode'} actualActivity={actualData} unlock={setUnlock} setSatisfiedConditions={setSatisfiedConditions}/>
        <CloseEndedTool isOpen={actualData?.type=='closeEndedQuestionNode'} actualActivity={actualData} unlock={setUnlock} setSatisfiedConditions={setSatisfiedConditions}/>
        <ReadMaterialTool isOpen={actualData?.type=='TrueFalseNode'} actualActivity={actualData} unlock={setUnlock} setSatisfiedConditions={setSatisfiedConditions}/>
      </Box>
      <IconButton 
        isDisabled={!unlock}
        hidden={unlock && satisfiedConditions==undefined}
        title={ unlock ? 'click to continue' : 'complete the assement'}
        right={'2%'}
        bottom={'0px'}
        position={'absolute'}
        backgroundColor={ unlock ? 'lightgreen' : 'red'}
        color={'grey'}
        aria-label="Continue"
        icon={<ArrowRightIcon />}
        onClick={()=>{console.log('continue '+ satisfiedConditions);
          if(!ctx) return;
          API.nextNodeProgression({ctxId: ctx, satisfiedConditions: satisfiedConditions}).then((value)=>{
            console.log(value);
            setActualData(value.data);
            setUnlock(false);});//add refresh tool -> useEffect che aggiornat gli stati
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
function setContinue(arg0: boolean) {
  throw new Error('Function not implemented.');
}


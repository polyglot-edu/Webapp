import {
  Button,
  Flex,
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


const FlowIndex = () => {

  const [actualData, setActualData] = useState<PolyglotNodeValidation>();
  
  const router = useRouter();
  const ctx = router.query?.id?.toString();
  
  useEffect(() => {
    if(ctx != undefined)
    API.getActualNodeInfo({ctxId: ctx}).then((resp) => {
    setActualData(resp.data);
    })
  }, []);

  return (
    <>
      {/* if is loading */}
      <Modal
        isOpen={true}
        onClose={() => console.log('Not closed')}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Flex align={'center'}>
              <Spinner size={'xl'} mr={5} />
              <Text fontSize={'xl'} fontWeight="bold">
                Loading flow...
              </Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
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

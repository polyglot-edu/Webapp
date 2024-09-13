import { Box, Flex, Heading } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { PolyglotNodeValidation } from '../../types/polyglotElements';
type ReadMaterialToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  unlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
};

type ReadMaterialData = {
  text: string;
  link: string;
};

const ReadMaterialTool = ({
  isOpen,
  actualActivity,
  unlock,
  setSatisfiedConditions,
}: ReadMaterialToolProps) => {
  if (!isOpen) return <></>;
  console.log('data check ' + actualActivity);
  const data =
    actualActivity?.data || ({ text: '', link: '' } as ReadMaterialData);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!data) return;
    unlock(true);
    const edgesId = actualActivity?.validation.map((edge) => edge.id);
    if (edgesId != undefined) setSatisfiedConditions(edgesId);
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
      <Heading size={'3xl'}>Read Material Activity</Heading>
      <Heading size={'xl'} paddingTop={'20px'}>
        Study the following text and link material
      </Heading>
      <br />
      <Flex>{data.text}</Flex>
      <Flex paddingTop={'50px'} hidden={!data.link}>
        Open this link for additional material: {data.link}
      </Flex>
    </Box>
  );
};

export default ReadMaterialTool;

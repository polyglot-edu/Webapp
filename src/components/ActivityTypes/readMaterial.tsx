import { Box, Flex, Link } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { PolyglotNodeValidation } from '../../types/polyglotElements';
import FlexText from '../CostumTypography/FlexText';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import HeadingTitle from '../CostumTypography/HeadingTitle';
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
      width={'80%'}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <HeadingTitle>Read Material Activity</HeadingTitle>
      <HeadingSubtitle>
        Study the following text and link material
      </HeadingSubtitle>
      <br />
      <FlexText>{data.text}</FlexText>
      <Flex paddingTop={'50px'} hidden={!data.link || data.link == ' '}>
        <Link href={data.link} color="#0890d3" target="_blank">
          Open this link for additional material
        </Link>
      </Flex>
    </Box>
  );
};

export default ReadMaterialTool;

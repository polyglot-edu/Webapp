import { Box, Button, Flex, Link, Textarea, useToast } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PolyglotNodeValidation } from '../../types/polyglotElements';
import HeadingTitle from '../CostumTypography/HeadingTitle';
import HeadingSubtitle from '../CostumTypography/HeadingSubtitle';
import FlexText from '../CostumTypography/FlexText';
import { API } from '../../data/api';

type ReadMaterialToolProps = {
  isOpen: boolean;
  actualActivity: PolyglotNodeValidation | undefined;
  unlock: Dispatch<SetStateAction<boolean>>;
  setSatisfiedConditions: Dispatch<SetStateAction<string[]>>;
  showNextButton: boolean;
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
  showNextButton,
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
      <HeadingSubtitle>Study the following text and link material</HeadingSubtitle>
      <br />
      <FlexText>{data.text}</FlexText>
      <Button
        top={'20px'}
        hidden={showNextButton}   
        position={'relative'}           
        color={'#0890d3'}
        border={'2px solid'}           
        borderColor={'#0890d3'}
        borderRadius={'8px'}
        _hover={{
          transform: 'scale(1.05)', 
          transition: 'all 0.2s ease-in-out',  
        }}
        onClick={async () => {     
          if (actualActivity?._id){
            const response = await API.downloadFile({ nodeId: actualActivity?._id });
            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition
              ?.split('filename=')?.[1]
              ?.replace(/"/g, '');
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename || 'uploadedFile.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          }
        }}
      >
        See pdf
      </Button>
      <Flex paddingTop={'50px'} hidden={!data.link || data.link == " "}>
        <Link  href={data.link} color='#0890d3' target="_blank">
          Open this link for additional material
        </Link>
      </Flex>
    </Box>
  );
};

export default ReadMaterialTool;

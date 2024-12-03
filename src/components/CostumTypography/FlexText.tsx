import { Flex } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

type flexTextProps = {
  children?: React.ReactNode;
  paddingTop?: string;
};

export default function FlexText({ children, paddingTop }: flexTextProps) {
  return (
    <Flex
      paddingTop={paddingTop || '10px'}
      justifyContent="center"
      fontSize="lg"
      flexDirection="column" 
      whiteSpace="pre-wrap"  
      wordBreak="break-word" 
    >
      {typeof children === 'string' ? (
        <ReactMarkdown>{children}</ReactMarkdown>
      ) : (
        children
      )}
    </Flex>
  );
}

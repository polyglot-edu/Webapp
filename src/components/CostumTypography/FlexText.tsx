import { Box } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

type flexTextProps = {
  children?: React.ReactNode;
  paddingTop?: string;
};

export default function FlexText({ children, paddingTop }: flexTextProps) {
  return (
    <Box
      paddingTop={paddingTop || '10px'}
      justifyContent="center"
      fontSize="lg"
      flexDirection="column"
      whiteSpace="pre-wrap"
      wordBreak="break-word"
      textAlign="left"
      sx={{
        ul: {
          marginLeft: '20px',
        },
        ol: {
          marginLeft: '20px',
        },
        li: {
          marginBottom: '8px',
        },
      }}
    >
      {typeof children === 'string' ? (
        <ReactMarkdown>{children}</ReactMarkdown>
      ) : (
        children
      )}
    </Box>
  );
}

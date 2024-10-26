import { Flex } from "@chakra-ui/react";

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
    >
      {children}
    </Flex>
  );
};
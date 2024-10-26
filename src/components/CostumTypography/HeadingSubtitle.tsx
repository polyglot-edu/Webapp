import { Heading } from "@chakra-ui/react";

type headingSubtitleProps = {
  children?: React.ReactNode;
  size?: string;
  paddingTop?: string;
  color?: string;
};

export default function HeadingSubtitle({ children, size, paddingTop, color }: headingSubtitleProps) {
  return (
    <Heading 
      size={size || 'lg'} 
      justifyContent="center" 
      paddingTop={paddingTop || '20px'}
      color = {color || '#ffa700'}
    >
      {children}
    </Heading>
  );
};
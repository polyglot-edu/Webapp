import { Heading } from '@chakra-ui/react';

type headingTitleProps = {
  children?: React.ReactNode;
  size?: string;
  color?: string;
};

export default function HeadingTitle({
  children,
  size,
  color,
}: headingTitleProps) {
  return (
    <Heading
      size={size || '2xl'}
      justifyContent="center"
      color={color || '#0890d3'}
    >
      {children}
    </Heading>
  );
}

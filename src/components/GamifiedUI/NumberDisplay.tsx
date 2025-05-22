import { Box, Button, Grid, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';

type NumberedDisplayType = {
  isOpen: boolean;
  onEnterAction: (code: string) => any;
  text: string;
};

const NumberedDisplay = ({
  isOpen,
  onEnterAction,
  text,
}: NumberedDisplayType) => {
  const [code, setCode] = useState('');

  const handleInput = (value: string) => {
    if (value === 'delete') {
      setCode(code.slice(0, -1));
    } else if (value === 'enter') {
      onEnterAction(code);
    } else {
      setCode(code + value);
    }
  };

  if (!isOpen) return <></>;
  return (
    <Box
      bg="transparent"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w="full"
        p={4}
        mb={2}
        textAlign="center"
        fontSize="xl"
        bg="gray.700"
        borderRadius="xl"
      >
        {code || text}
      </Box>
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={2}
        p={4}
        bg="gray.800"
        borderRadius="xl"
        boxShadow="lg"
        width="full"
      >
        {[...Array(9).keys()].map((num) => (
          <Button
            key={num + 1}
            size="md"
            onClick={() => handleInput((num + 1).toString())}
          >
            {num + 1}
          </Button>
        ))}
        <Button
          size="md"
          colorScheme="red"
          onClick={() => handleInput('delete')}
        >
          ⌫
        </Button>
        <Button size="md" onClick={() => handleInput('0')}>
          0
        </Button>
        <Button
          size="md"
          colorScheme="green"
          onClick={() => handleInput('enter')}
        >
          ⏎
        </Button>
      </Grid>
    </Box>
  );
};

export default NumberedDisplay;

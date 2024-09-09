/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
//import "../FlowShower.css"; // Ensure this CSS file is updated for new styles
import {
  Box,
  Center,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';

function FlowShower() {
  return (
    <Center>
      <Box marginTop={'20px'}>
        <Heading as="h1">Welcome in our little educational space</Heading>
        <Box>This world is divided in 5 areas:</Box>
        <UnorderedList>
          <ListItem>
            <Text color={'#5db048'}>"outside"</Text>: where you can rest in our
            quiet zone and the flows menu where you can choose which learning
            path you want to do;
          </ListItem>
          <ListItem>
            <Text color={'#434fbf'}>"webapp"</Text>: from the single laptop on
            the left, there you can access to our webapp to execute some
            lessons;
          </ListItem>
          <ListItem>
            <Text color={'#878686'}>"Computer Lab"</Text>: in the multiple
            computer area, you will be able to do coding exercise;
          </ListItem>
          <ListItem>
            <Text color={'#e68c17'}>"White Board"</Text>: on the top right area
            you can do collaborative assigment;
          </ListItem>
          <ListItem>
            <Text color={'#b322e3'}>"Room Meeting"</Text>: inside the private
            room, it's possible to have private meeting with the educator or
            expert that can help you with your doubts;
          </ListItem>
        </UnorderedList>
        <Box>
          These are the information of the learning path you have selected, if
          you want to change learning path you can do it from the joystick area
          outside.
        </Box>
      </Box>
    </Center>
  );
}

export default FlowShower;

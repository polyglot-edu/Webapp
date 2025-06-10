import { Box, Flex } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import HeadingSubtitle from '../../components/CostumTypography/HeadingSubtitle';
import HeadingTitle from '../../components/CostumTypography/HeadingTitle';
import auth0 from '../../utils/auth0';

const GymIndexPage = () => {
  return (
    <>
      <Box display="flex" flexDirection="column" minHeight="100vh" bg="gray.50">
        <Box
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={1}
        >
          <Flex
            bg="white"
            p={10}
            shadow="md"
            borderRadius="lg"
            mt="60px"
            mb="60px"
            width={{ base: '90%', md: '70%', lg: '60%' }}
            textAlign="center"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <HeadingTitle>No execution context found!</HeadingTitle>
            <HeadingSubtitle>
              Reopen the page from the correct tool :D
            </HeadingSubtitle>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default GymIndexPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth0.getSession(ctx.req, ctx.res);

  if (!session) return { props: {} };

  return {
    props: {
      accessToken: session.accessToken,
    },
  };
};

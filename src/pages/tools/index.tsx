import { Box, Heading } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import auth0 from '../../utils/auth0';

const FlowIndexPage = () => {
  return (
    <>
      <Box px="10%">
        <Heading size={'md'} textAlign="center">
          No execution context found! <br />
          Reopen the page from the correct tool :D
        </Heading>
      </Box>
    </>
  );
};

export default FlowIndexPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth0.getSession(ctx.req, ctx.res);

  if (!session) return { props: {} };

  return {
    props: {
      accessToken: session.accessToken,
    },
  };
};

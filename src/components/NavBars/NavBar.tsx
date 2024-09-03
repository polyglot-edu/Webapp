import { UserProfile } from '@auth0/nextjs-auth0/client';
import { Button, HStack, Image } from '@chakra-ui/react';
import Link from 'next/link';
import brandLogo from '../../public/solo_logo.png';
import brandWrite from '../../public/solo_scritta.png';
import Nav from '../Layout/NavBar';

export default function Navbar() {
  return (
    <Nav>
      <HStack>
        <Image
          src={brandLogo.src}
          width={['40px']}
          className="mr-3"
          alt="Polyglot Logo"
        />
        <Image
          src={brandWrite.src}
          width={['0px', '110px']}
          className="mr-3 self-center"
          alt="Polyglot Logo"
        />
      </HStack>
    </Nav>
  );
}

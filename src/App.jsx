import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ChakraProvider, Box, Flex, Heading } from '@chakra-ui/react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@supabase/supabase-js';
import Navbar from './components/Navbar';
import { Road } from './routes'; // Assumes Road is a component that handles routing for different app sections
import localization from './localization';
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ChakraProvider>
      <Router>
        {session ? (
          <LayoutWithSidebar />
        ) : (
          <Flex
            direction="column"
            align="center"
            justify="center"
            h="100vh"
          >
            <Heading mb={4}>Compty 👨‍🚀</Heading> {/* Title for login session */}
            <Auth
              maxW='90%'
              textAlign="center"
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa, 
                style: {
                  button: { background: 'pink'},
                  anchor: { color: 'pink' },
                },
              }}
              providers={['google', 'facebook', 'twitter']}  
              localization={localization}
            />
          </Flex>
        )}
      </Router>
    </ChakraProvider>
  );
}

const LayoutWithSidebar = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== '/d2035'; // Example: hide sidebar on specific route

  return (
    <Flex h="100vh" overflowY="hidden">
      {showSidebar && <Box position="fixed" h="full" w="250px" overflowY="auto"><Navbar /></Box>}
      <Box flex="1" pl={showSidebar ? "270px" : "0"} pr={5} pt={5} overflowY="auto">
        <Road showSidebar={showSidebar} />
      </Box>
    </Flex>
  );
};

export default App;
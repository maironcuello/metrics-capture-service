import React from 'react';
import ErrorDashboard from './components/ErrorDashboard';
import styled from 'styled-components';

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

function App() {
  return (
    <AppContainer>
      <ErrorDashboard />
    </AppContainer>
  );
}

export default App;
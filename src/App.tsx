import { useState, useEffect } from 'react';
import { ExperienceProvider } from './context/ExperienceContext';
import { Layout } from './components/Layout';
import { ChapterRenderer } from './components/ChapterRenderer';
import { LandingPage } from './components/LandingPage';

function App() {
  const [hasParams, setHasParams] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('to') && params.has('from')) {
        setHasParams(true);
      }
    } catch (e) {
      console.error('URL parsing failed:', e);
    }
  }, []);

  return (
    <ExperienceProvider>
      {hasParams ? (
        <Layout>
          <ChapterRenderer />
        </Layout>
      ) : (
        <LandingPage onStartSurprise={() => setHasParams(true)} />
      )}
    </ExperienceProvider>
  );
}

export default App;

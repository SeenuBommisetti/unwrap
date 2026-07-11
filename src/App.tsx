import { ExperienceProvider } from './context/ExperienceContext';
import { Layout } from './components/Layout';
import { ChapterRenderer } from './components/ChapterRenderer';

function App() {
  return (
    <ExperienceProvider>
      <Layout>
        <ChapterRenderer />
      </Layout>
    </ExperienceProvider>
  );
}

export default App;

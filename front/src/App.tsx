import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const CharactersPage = lazy(() => import('./pages/CharactersPage'));
const CharacterDetailPage = lazy(() => import('./pages/CharacterDetailPage'));

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<CharactersPage />} />
        <Route
          path="/character/:characterId"
          element={<CharacterDetailPage />}
        />
      </Routes>
    </div>
  );
}
export default App;

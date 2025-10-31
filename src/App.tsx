import { useState } from 'react';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AllProducts } from './components/AllProducts/AllProducts';

type Page = 'dashboard' | 'allProducts';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === 'dashboard' && (
        <Dashboard onNavigateToAllProducts={() => handleNavigate('allProducts')} />
      )}
      {currentPage === 'allProducts' && (
        <AllProducts onBack={() => handleNavigate('dashboard')} />
      )}
    </>
  );
}

export default App;

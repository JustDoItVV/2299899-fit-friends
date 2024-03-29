import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';

import { checkAuthAction, selectAuthStatus } from '@2299899-fit-friends/storage';

import { useAppDispatch, useAppSelector } from './components/hooks';

export function App() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);

  useEffect(() => {
    dispatch(checkAuthAction());
  }, [dispatch, authStatus]);

  return (
    <HelmetProvider>
      <Routes>
        <Route />
        <Route />
        <Route />
        <Route />
        <Route />
        <Route />
        <Route />
      </Routes>
    </HelmetProvider>
  );
}

export default App;

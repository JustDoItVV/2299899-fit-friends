import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';

import { checkAuthAction, selectAuthStatus } from '@2299899-fit-friends/storage';
import { FrontendRoute } from '@2299899-fit-friends/types';

import { useAppDispatch, useAppSelector } from './components/hooks';
import IntroPage from './pages/intro-page/intro.page';
import LoginPage from './pages/login-page/login.page';
import MainPage from './pages/main-page/main.page';
import PersonalPage from './pages/personal-page/personal.page';
import RegistrationPage from './pages/registration-page/registration.page';
import TrainingCardPage from './pages/training-card-page/training-card.page';
import TrainingsPage from './pages/trainings-page/trainings.page';
import UserCardPage from './pages/user-card-page/user-card.page';
import UsersPage from './pages/users-page/users.page';

export function App() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);

  useEffect(() => {
    dispatch(checkAuthAction());
  }, [dispatch, authStatus]);

  return (
    <HelmetProvider>
      <Routes>
        <Route path={FrontendRoute.Intro} element={<IntroPage />} />
        <Route path={FrontendRoute.Login} element={<LoginPage />} />
        <Route path={FrontendRoute.Registration} element={<RegistrationPage />} />
        <Route path={FrontendRoute.Personal} element={<PersonalPage />} />
        <Route path={FrontendRoute.Main} element={<MainPage />} />
        <Route path={FrontendRoute.Users} element={<UsersPage />} />
        <Route path={FrontendRoute.UserCard} element={<UserCardPage />} />
        <Route path={FrontendRoute.Trainings} element={<TrainingsPage />} />
        <Route path={FrontendRoute.TrainingCard} element={<TrainingCardPage />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;

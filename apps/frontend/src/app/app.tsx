import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';

import { FrontendRoute, UserRole } from '@2299899-fit-friends/types';

import AnonymousRoute from './components/anonymous-route/anonymous-route';
import AuthorizedRoute from './components/authorized-route/authorized-route';
import RoleRoute from './components/role-route/role-route';
import IntroPage from './pages/intro-page/intro.page';
import LoginPage from './pages/login-page/login.page';
import MainPage from './pages/main-page/main.page';
import NotFoundPage from './pages/not-found-page/not-found.page';
import PersonalPage from './pages/personal-page/personal.page';
import QuestionnairePage from './pages/questionnaire-page/questionnaire-page';
import RegistrationPage from './pages/registration-page/registration.page';
import TrainingCardPage from './pages/training-card-page/training-card.page';
import TrainingsCreatePage from './pages/trainings-create-page/trainings-create.page';
import TrainingsPage from './pages/trainings-page/trainings.page';
import UserCardPage from './pages/user-card-page/user-card.page';
import UsersPage from './pages/users-page/users.page';

export function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path={FrontendRoute.Intro} element={<IntroPage />} />
        <Route path={FrontendRoute.Login} element={
          <AnonymousRoute children={<LoginPage />} />
        } />
        <Route path={FrontendRoute.Registration} element={
          <AnonymousRoute children={<RegistrationPage />} />
        } />
        <Route path={FrontendRoute.Questionnaire} element={
          <AuthorizedRoute children={<QuestionnairePage />} />
        } />
        <Route path={FrontendRoute.Personal} element={
          <AuthorizedRoute children={<PersonalPage />} />
        } />
        <Route path={`${FrontendRoute.Personal}${FrontendRoute.Create}`} element={
          <AuthorizedRoute>
            <RoleRoute role={UserRole.Trainer}>
              <TrainingsCreatePage />
            </RoleRoute>
          </AuthorizedRoute>
        } />
        <Route path={FrontendRoute.Main} element={
          <AuthorizedRoute children={<MainPage />} />
        } />
        <Route path={FrontendRoute.Users} element={
          <AuthorizedRoute children={<UsersPage />} />
        } />
        <Route path={FrontendRoute.UserCard} element={
          <AuthorizedRoute children={<UserCardPage />} />
        } />
        <Route path={FrontendRoute.Trainings} element={
          <AuthorizedRoute children={<TrainingsPage />} />
        } />
        <Route path={FrontendRoute.TrainingCard} element={
          <AuthorizedRoute children={<TrainingCardPage />} />
        } />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;

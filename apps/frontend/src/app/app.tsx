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
        <Route path={''} element={<IntroPage />} />
        <Route path={FrontendRoute.Login} element={
          <AnonymousRoute>
            <LoginPage />
          </AnonymousRoute>
        } />
        <Route path={FrontendRoute.Registration} element={
          <AnonymousRoute>
            <RegistrationPage />
          </AnonymousRoute>
        } />
        <Route path={FrontendRoute.Questionnaire} element={
          <AuthorizedRoute>
            <QuestionnairePage />
          </AuthorizedRoute>
        } />
        <Route path={FrontendRoute.Personal}>
          <Route path={''} element={<AuthorizedRoute children={<PersonalPage />} />} />
          <Route path={FrontendRoute.Create} element={<RoleRoute role={UserRole.Trainer} children={<TrainingsCreatePage />} />} />
        </Route>
        <Route path={FrontendRoute.Main} element={
          <AuthorizedRoute>
            <MainPage />
          </AuthorizedRoute>
        } />
        <Route path={FrontendRoute.Users} element={
          <AuthorizedRoute>
            <UsersPage />
          </AuthorizedRoute>
        } />
        <Route path={FrontendRoute.UserCard} element={
          <AuthorizedRoute>
            <UserCardPage />
          </AuthorizedRoute>
        } />
        <Route path={FrontendRoute.Trainings} element={
          <AuthorizedRoute>
            <TrainingsPage />
          </AuthorizedRoute>
        } />
        <Route path={FrontendRoute.TrainingCard} element={
          <AuthorizedRoute>
            <TrainingCardPage />
          </AuthorizedRoute>
        } />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;

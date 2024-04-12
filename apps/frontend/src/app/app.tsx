import './style.css';

import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';

import { FrontendRoute, UserRole } from '@2299899-fit-friends/types';

import RouteAnonymous from './components/routes/route-anonymous/route-anonymous';
import RouteAuthorized from './components/routes/route-authorized/route-authorized';
import RouteRole from './components/routes/route-role/route-role';
import AccountFriendsPage from './pages/account-friends-page/account-friends.page';
import AccountOrdersPage from './pages/account-orders-page/account-orders.page';
import AccountPage from './pages/account-page/account.page';
import AccountPurchasesPage from './pages/account-purchases-page/account-purchases.page';
import AccountTrainingsPage from './pages/account-trainings-page/account-trainings.page';
import IntroPage from './pages/intro-page/intro.page';
import LoginPage from './pages/login-page/login.page';
import MainPage from './pages/main-page/main.page';
import NotFoundPage from './pages/not-found-page/not-found.page';
import QuestionnairePage from './pages/questionnaire-page/questionnaire-page';
import RegistrationPage from './pages/registration-page/registration.page';
import TrainingCardPage from './pages/training-card-page/training-card.page';
import TrainingsCreatePage from './pages/trainings-create-page/trainings-create.page';
import TrainingsPage from './pages/trainings-page/trainings.page';
import UserCardPage from './pages/user-card-page/user-card.page';
import UsersPage from './pages/users-page/users.page';

export default function App() {
  return (
    <HelmetProvider>
      <Routes location={''}>
        <Route path={''} element={<IntroPage />} />
        <Route path={FrontendRoute.Login} element={<RouteAnonymous children={
          <LoginPage />
        } />} />
        <Route path={FrontendRoute.Registration} element={<RouteAnonymous children={
          <RegistrationPage />
        } />} />
        <Route path={FrontendRoute.Questionnaire} element={<RouteAuthorized children={
          <QuestionnairePage />
        } />} />
        <Route path={FrontendRoute.Main} element={<RouteAuthorized children={
          <RouteRole role={UserRole.User} redirect={`/${FrontendRoute.Account}`} children={
            <MainPage />
          } />
        } />} />
        <Route path={FrontendRoute.Account}>
          <Route path={''} element={<RouteAuthorized children={
            <AccountPage />
          } />} />
          <Route path={FrontendRoute.Friends} element={<RouteAuthorized children={
            <AccountFriendsPage />
          } />} />
          <Route path={FrontendRoute.Create} element={<RouteAuthorized children={
            <RouteRole role={UserRole.Trainer} children={
              <TrainingsCreatePage />
            } />
          } /> } />
          <Route path={FrontendRoute.Trainings} element={<RouteAuthorized children={
            <RouteRole role={UserRole.Trainer} children={
              <AccountTrainingsPage />
            } />
          } />} />
          <Route path={FrontendRoute.Orders} element={<RouteAuthorized children={
            <RouteRole role={UserRole.Trainer} children={
              <AccountOrdersPage />
            } />
          } />} />
          <Route path={FrontendRoute.Purchases} element={<RouteAuthorized children={
            <RouteRole role={UserRole.User} children={
              <AccountPurchasesPage />
            } />
          } />} />
        </Route>
        <Route path={FrontendRoute.Trainings}>
          <Route path='' element={<RouteAuthorized children={
            <RouteRole role={UserRole.User} children={
              <TrainingsPage />
            } />
          } />} />
          <Route path=':id' element={<RouteAuthorized children={
            <TrainingCardPage />
          } />} />
        </Route>
        <Route path={FrontendRoute.Users}>
          <Route path='' element={<RouteAuthorized children={
            <UsersPage />
          } />} />
          <Route path=':id' element={<RouteAuthorized children={
            <UserCardPage />
          } />} />
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </HelmetProvider>
  );
}

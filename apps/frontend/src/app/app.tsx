import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';

import { FrontendRoute, UserRole } from '@2299899-fit-friends/types';

import AnonymousRoute from './components/anonymous-route/anonymous-route';
import AuthorizedRoute from './components/authorized-route/authorized-route';
import RoleRoute from './components/role-route/role-route';
import AccountFriendsPage from './pages/account-friends-page/account-friends.page';
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

export function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path={''} element={<IntroPage />} />
        <Route path={FrontendRoute.Login} element={<AnonymousRoute children={<LoginPage />} />} />
        <Route path={FrontendRoute.Registration} element={<AnonymousRoute children={<RegistrationPage />} />} />
        <Route path={FrontendRoute.Questionnaire} element={<AuthorizedRoute children={<QuestionnairePage />} />} />
        <Route path={FrontendRoute.Account}>
          <Route path={''} element={<AuthorizedRoute children={<AccountPage />} />} />
          <Route path={FrontendRoute.Friends} element={<AuthorizedRoute children={<AccountFriendsPage />} />} />
          <Route path={FrontendRoute.Create} element={<AuthorizedRoute children={<RoleRoute role={UserRole.Trainer} children={<TrainingsCreatePage />} />} /> } />
          <Route path={FrontendRoute.Trainings} element={<AuthorizedRoute children={<RoleRoute role={UserRole.Trainer} children={<AccountTrainingsPage />} />} />} />
          <Route path={FrontendRoute.Orders} element={<AuthorizedRoute children={<RoleRoute role={UserRole.Trainer} children={<AccountPurchasesPage />} />} />} />
          <Route path={FrontendRoute.Purchases} element={<AuthorizedRoute children={<RoleRoute role={UserRole.User} children={<AccountPurchasesPage />} />} />} />
        </Route>
        <Route path={FrontendRoute.Main} element={<AuthorizedRoute children={<MainPage />} />} />
        <Route path={FrontendRoute.Users} element={<AuthorizedRoute children={<UsersPage />} />} />
        <Route path={FrontendRoute.UserCard} element={<AuthorizedRoute children={<UserCardPage />} />} />
        <Route path={FrontendRoute.Trainings} element={<AuthorizedRoute children={<TrainingsPage />} />} />
        <Route path={FrontendRoute.TrainingCard} element={<AuthorizedRoute children={<TrainingCardPage />} />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;

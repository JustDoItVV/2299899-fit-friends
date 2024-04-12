import { useEffect } from 'react';

import {
    fetchUserAction, selectCurrentUser, useAppDispatch, useAppSelector
} from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, UserRole } from '@2299899-fit-friends/types';

import AccountAbout from '../../components/account-about/account-about';
import AccountCertificates from '../../components/account-certificates/account-certificates';
import AccountPanelTrainer from '../../components/account-panel-trainer/account-panel-trainer';
import AccountPanelUser from '../../components/account-panel-user/account-panel-user';
import AccountUserSchedule from '../../components/account-user-schedule/account-user-schedule';
import Header from '../../components/header/header';

export default function AccountPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUserAction(currentUser?.id));
    }
  }, [dispatch, currentUser]);

  return (
    <div className="wrapper">
      <Header page={FrontendRoute.Account} />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Личный кабинет</h1>
              <AccountAbout />
              <div className="inner-page__content">
                {
                  currentUser?.role === UserRole.Trainer
                  ? <div className="personal-account-coach">
                      <AccountPanelTrainer />
                      <AccountCertificates />
                    </div>
                  : <div className="personal-account-user">
                      <AccountUserSchedule />
                      <AccountPanelUser />
                    </div>
                }
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

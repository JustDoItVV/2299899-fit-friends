import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import {
    checkAuth, selectAuthStatus, selectCurrentUser, useAppDispatch, useAppSelector
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus, FrontendRoute, UserRole } from '@2299899-fit-friends/types';

import Loading from '../../loading/loading';

type RouteAnonymousProps = {
  children: JSX.Element;
};

export default function RouteAnonymous({ children }: RouteAnonymousProps): JSX.Element {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (authStatus === AuthStatus.Unknown) {
    return <Loading />;
  }

  return authStatus === AuthStatus.NoAuth
    ? children
    : <Navigate to={`/${currentUser?.role === UserRole.Trainer ? FrontendRoute.Account : FrontendRoute.Main}`}/>;
}

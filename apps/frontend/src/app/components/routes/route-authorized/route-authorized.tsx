import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import {
    checkAuth, selectAuthStatus, useAppDispatch, useAppSelector
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus, FrontendRoute } from '@2299899-fit-friends/types';

import Loading from '../../loading/loading';

type RouteAuthorizedProps = {
  children: JSX.Element | JSX.Element[];
};

export default function RouteAuthorized({ children }: RouteAuthorizedProps): JSX.Element | JSX.Element[] {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (authStatus === AuthStatus.Unknown) {
    return <Loading />;
  }

  return authStatus === AuthStatus.Auth ? children : <Navigate to={`/${FrontendRoute.Login}`} />;
}

import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { checkAuthAction, selectAuthStatus } from '@2299899-fit-friends/storage';
import { AuthStatus, FrontendRoute } from '@2299899-fit-friends/types';

import { useAppDispatch, useAppSelector } from '../hooks';
import Loading from '../loading/loading';

type AuthorizedRouteProps = {
  children: JSX.Element;
};

export default function AuthorizedRoute(props: AuthorizedRouteProps): JSX.Element {
  const { children } = props;
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);

  useEffect(() => {
    dispatch(checkAuthAction());
  }, [dispatch]);

  if (authStatus === AuthStatus.Unknown) {
    return <Loading />;
  }

  return authStatus === AuthStatus.Auth
    ? children
    : <Navigate to={FrontendRoute.Login} />;
}

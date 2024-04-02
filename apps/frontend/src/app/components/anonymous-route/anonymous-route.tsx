import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { checkAuthAction, selectAuthStatus, selectCurrentUser } from '@2299899-fit-friends/storage';
import { AuthStatus, FrontendRoute, UserRole } from '@2299899-fit-friends/types';

import { useAppDispatch, useAppSelector } from '../hooks';
import Loading from '../loading/loading';

type AnonymousRouteProps = {
  children: JSX.Element;
};

export default function AnonymousRoute(props: AnonymousRouteProps): JSX.Element {
  const { children } = props;
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(checkAuthAction());
  }, [dispatch]);

  if (authStatus === AuthStatus.Unknown) {
    return <Loading />;
  }

  return authStatus === AuthStatus.NoAuth
    ? (children)
    : (<Navigate to={currentUser?.role === UserRole.Trainer ? FrontendRoute.Personal : FrontendRoute.Main} />);
}

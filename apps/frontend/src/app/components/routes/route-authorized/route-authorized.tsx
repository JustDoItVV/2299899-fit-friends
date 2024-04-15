import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';

import { SEND_NEWSLETTER_EMAIL_EVERY_SECONDS } from '@2299899-fit-friends/consts';
import {
    checkAuth, selectAuthStatus, selectCurrentUser, sendNewTrainingsMail, useAppDispatch,
    useAppSelector
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus, FrontendRoute, UserRole } from '@2299899-fit-friends/types';

import Loading from '../../loading/loading';

type RouteAuthorizedProps = {
  children: JSX.Element | JSX.Element[];
};

export default function RouteAuthorized({ children }: RouteAuthorizedProps): JSX.Element | JSX.Element[] {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);
  const currentUser = useAppSelector(selectCurrentUser);

  const sendedRef = useRef<boolean>(false);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser && currentUser.role === UserRole.User) {
      if (dayjs().diff(dayjs(currentUser.emailLastDate), 'second') > SEND_NEWSLETTER_EMAIL_EVERY_SECONDS && !sendedRef.current) {
        dispatch(sendNewTrainingsMail());
        sendedRef.current = true;
      } else {
        sendedRef.current = false;
      }
    }
  }, [currentUser, dispatch]);

  if (authStatus === AuthStatus.Unknown) {
    return <Loading />;
  }

  return authStatus === AuthStatus.Auth ? children : <Navigate to={`/${FrontendRoute.Login}`} />;
}

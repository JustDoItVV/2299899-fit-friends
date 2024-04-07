import { useEffect, useState } from 'react';

import { FetchFileParams } from '@2299899-fit-friends/types';
import { AsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk';

import { useAppDispatch } from './';

export function useFetchFileUrl(
  fetch: AsyncThunk<string, FetchFileParams, AsyncThunkConfig>,
  params?: FetchFileParams,
  defaultValue = ''
) {
  const dispatch = useAppDispatch();
  const [fileUrl, setFileUrl] = useState<string>(defaultValue);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (params) {
        try {
          const url = unwrapResult(await dispatch(fetch(params)));
          setFileUrl(url);
        } catch {
          setFileUrl(defaultValue);
        }
      }
    };

    fetchAvatar();
  }, [dispatch]);

  return fileUrl;
}

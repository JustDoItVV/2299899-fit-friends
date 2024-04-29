import { useEffect, useState } from 'react';

import { FetchFileParams } from '@2299899-fit-friends/types';
import { AsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk';

import { useAppDispatch } from './use-app-dispatch';

export function useFetchFileUrl(
  fetch: AsyncThunk<string, FetchFileParams, AsyncThunkConfig>,
  params?: FetchFileParams,
  defaultValue = '',
  dependencies: unknown[] = [],
) {
  const dispatch = useAppDispatch();
  const [fileUrl, setFileUrl] = useState<string>(defaultValue);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFile = async () => {
      if (params && (params.id || params.path)) {
        let url: string = defaultValue;
        setLoading(true);
        try {
          url = unwrapResult(await dispatch(fetch(params)));
        } catch {
          url = defaultValue;
        } finally {
          setFileUrl(url);
          setLoading(false);
        }
      }
    };

    fetchFile();
  }, [dispatch, ...dependencies]);

  return { fileUrl, setFileUrl, loading };
}

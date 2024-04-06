import { useEffect, useState } from 'react';

import { AsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk';

import { useAppDispatch } from './';

export function useFetchFileUrl(
  itemId: string | undefined,
  fetch: AsyncThunk<string, string, AsyncThunkConfig>,
  defaultValue = ''
) {
  const dispatch = useAppDispatch();
  const [fileUrl, setFileUrl] = useState<string>(defaultValue);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (itemId) {
        try {
          const url = unwrapResult(await dispatch(fetch(itemId)));
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

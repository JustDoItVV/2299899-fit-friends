import { memo, useEffect, useState } from 'react';

import { CatalogItem, fetchTraining, useAppDispatch } from '@2299899-fit-friends/frontend-core';
import { Balance, Training } from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';

import Loading from '../../loading/loading';
import CardTraining from '../card-training/card-training';

type CardTrainingBalanceProps = {
  item: CatalogItem;
};

export default memo(function CardTrainingBalance({ item }: CardTrainingBalanceProps): JSX.Element {
  const balance = item as Balance;
  const dispatch = useAppDispatch();
  const [training, setTraining] = useState<Training | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const training = unwrapResult(await dispatch(fetchTraining(balance.trainingId)));
      setTraining(training);
    };

    fetch();
  }, [dispatch, balance]);

  if (!training) {
    return <Loading />;
  }

  return (
    <CardTraining item={training} />
  );
});

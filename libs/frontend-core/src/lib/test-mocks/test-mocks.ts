import { randomInt, randomUUID } from 'node:crypto';
import { join } from 'node:path';

import {
    BalanceAvailable, CaloriesPerDayLimit, CaloriesTargetLimit, METRO_STATIONS, MOCK_EMAIL_OPTIONS,
    MockCertificate, OrderAmountLimit, PriceLimit, RatingLimit, TRAINING_TYPE_LIMIT
} from '@2299899-fit-friends/consts';
import { randomArrayElement } from '@2299899-fit-friends/helpers';
import {
    AuthStatus, NameSpace, OrderPaymentMethod, OrderType, TrainingAuditory, TrainingDuration,
    TrainingLevel, TrainingRequestStatus, TrainingType, User, UserGender, UserRole
} from '@2299899-fit-friends/types';
import { faker } from '@faker-js/faker';

export const makeFakeUser = (): User => {
  const role = randomArrayElement(Object.values(UserRole));

  const avatarName = `${randomUUID()}-avatar`;
  const avatar = join('uploads', avatarName);

  const pageBackgroundName = `${randomUUID()}-pageBackground`;
  const pageBackground = join('uploads', pageBackgroundName);


  const certificates = [];
  if (role === UserRole.Trainer) {
    const certificatesCount = randomInt(1, MockCertificate.Count + 1);
    for (let i = 1; i <= certificatesCount; i++) {
      const mockCertificateName = `${MockCertificate.Prefix}${i}${MockCertificate.Suffix}`;
      const certificateName = `${randomUUID()}-${mockCertificateName}`;
      certificates.push(join('uploads', certificateName));
    }
  }

  return {
    name: faker.person.fullName(),
    email: faker.internet.email(MOCK_EMAIL_OPTIONS),
    avatar,
    passwordHash: 'mock',
    gender: faker.helpers.arrayElement(Object.values(UserGender)) as UserGender,
    birthdate: faker.date.birthdate(),
    role,
    description: faker.person.bio(),
    location: faker.helpers.arrayElement(METRO_STATIONS),
    pageBackground,
    trainingLevel: faker.helpers.arrayElement(Object.values(TrainingLevel)) as TrainingLevel,
    trainingType: faker.helpers.arrayElements(Object.values(TrainingType), TRAINING_TYPE_LIMIT) as TrainingType[],
    trainingDuration:
      role == UserRole.User
        ? (faker.helpers.arrayElement(Object.values(TrainingDuration)) as TrainingDuration)
        : TrainingDuration.Eighty,
    caloriesTarget:
      role == UserRole.User
        ? faker.number.int({ min: CaloriesTargetLimit.Min, max: CaloriesTargetLimit.Max })
        : CaloriesTargetLimit.Min,
    caloriesPerDay:
      role == UserRole.User
        ? faker.number.int({ min: CaloriesPerDayLimit.Min, max: CaloriesPerDayLimit.Max })
        : CaloriesPerDayLimit.Min,
    isReadyToTraining: role == UserRole.User ? faker.datatype.boolean() : false,
    certificates,
    merits: faker.person.bio(),
    isReadyToPersonal: role == UserRole.Trainer ? faker.datatype.boolean() : false,
  }
};

export const makeFakeResponseError = () => ({
  error: faker.hacker.phrase(),
  message: faker.hacker.phrase(),
  statusCode: faker.number.int({ min: 400, max: 500 }),
});

export const makeFakeTraining = () => {
  const backgroundPictureName = `${randomUUID()}-mockBackgroundPicture`;
  const backgroundPicture = join('uploads', backgroundPictureName);

  const videoName = `${randomUUID()}-mockVideo`;
  const video = join('uploads', videoName);

  return {
    title: faker.commerce.productName(),
    backgroundPicture,
    level: faker.helpers.arrayElement(Object.values(TrainingLevel)) as TrainingLevel,
    type: faker.helpers.arrayElement(Object.values(TrainingType)) as TrainingType,
    duration: faker.helpers.arrayElement(Object.values(TrainingDuration)) as TrainingDuration,
    price: faker.number.int({ min: PriceLimit.Min, max: PriceLimit.MockMax }),
    calories: faker.number.int({ min: CaloriesTargetLimit.Min, max: CaloriesTargetLimit.Max }),
    description: faker.commerce.productDescription(),
    gender: faker.helpers.arrayElement(Object.values(TrainingAuditory)) as TrainingAuditory,
    video,
    rating: 0,
    userId: randomUUID(),
    isSpecialOffer: faker.datatype.boolean(),
  };
};

export const makeFakeReview = () => ({
  userId: randomUUID(),
  trainingId: randomUUID(),
  rating: faker.number.int({ min: RatingLimit.Min, max: RatingLimit.Max }),
  text: faker.commerce.productDescription(),
});

export const makeFakeBalance = () => ({
  userId: randomUUID(),
  trainingId: randomUUID(),
  available: faker.number.int({ min: BalanceAvailable.Min, max: BalanceAvailable.Max }),
})

export const makeFakeState = () => {
  return {
    [NameSpace.App]: {
      authStatus: AuthStatus.Unknown,
      currentUser: makeFakeUser(),
      responseError: makeFakeResponseError(),
    },
    [NameSpace.User]: {
      user: makeFakeUser(),
      isLoading: false,
    },
    [NameSpace.Training]: {
      training: makeFakeTraining(),
      reviews: [makeFakeReview(), makeFakeReview()],
      balance: makeFakeBalance(),
      isLoading: false,
    },
  };
};

export const makeFakeOrder = () => {
  const training = makeFakeTraining();
  const amount = faker.number.int({ min: OrderAmountLimit.Min, max: OrderAmountLimit.Max });

  return {
    type: OrderType.Subscription,
    trainingId: randomUUID(),
    price: training.price,
    amount,
    orderSum: training.price * amount,
    paymentMethod: faker.helpers.arrayElement(Object.values(OrderPaymentMethod)),
    training,
  };
};

export const makeFakeNotification = () => ({
  userId: randomUUID(),
  text: faker.commerce.productDescription(),
});

export const makeFakeRequest = () => ({
  authorId: randomUUID(),
  targetId: randomUUID(),
  status: faker.helpers.arrayElement(Object.values(TrainingRequestStatus)),
});

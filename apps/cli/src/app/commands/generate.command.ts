import { genSalt, hash } from 'bcrypt';
import chalk from 'chalk';
import { randomInt, randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { BackendConfig } from '@2299899-fit-friends/config';
import {
    BalanceAvailable, CaloriesPerDayLimit, CaloriesTargetLimit, METRO_STATIONS, MOCK_EMAIL_OPTIONS,
    MockCertificate, OrderAmountLimit, PriceLimit, RatingLimit, SALT_ROUNDS, TRAINING_TYPE_LIMIT
} from '@2299899-fit-friends/consts';
import {
    Balance, CliCommand, Notification, Order, OrderPaymentMethod, OrderType, Review, Training,
    TrainingAuditory, TrainingDuration, TrainingLevel, TrainingRequest, TrainingRequestStatus,
    TrainingType, User, UserGender, UserRole
} from '@2299899-fit-friends/types';
import { faker } from '@faker-js/faker';
import { PrismaClient, Training as TrainingModel, User as UserModel } from '@prisma/client';

export class GenerateCommand implements CliCommand {
  private readonly name = '--generate';
  private readonly config = BackendConfig;
  private readonly DATE_FORMAT = 'YYYY MM';

  private getSubDirectoryUpload(): string {
    const [year, month] = dayjs().format(this.DATE_FORMAT).split(' ');
    return join(year, month);
  }

  private async generateMockUsers(count: number): Promise<User[]> {
    const salt = await genSalt(SALT_ROUNDS);
    const mockUsers: User[] = [];
    const uploadDirectory = join(this.config().uploadDirectory, this.getSubDirectoryUpload());

    if (!existsSync(uploadDirectory)) {
      mkdirSync(uploadDirectory, { recursive: true });
    }

    for (let i = 0; i < count; i++) {
      const role = i % 2 ? UserRole.Trainer : UserRole.User;

      const mockAvatarDirectory = `${this.config().publicDirectory}/img/content/avatars/${role === UserRole.Trainer ? 'coaches' : 'users'}`;
      const mockAvatarName = faker.helpers.arrayElement(readdirSync(mockAvatarDirectory));
      const avatarName = `${randomUUID()}-${mockAvatarName}`;
      copyFileSync(join(mockAvatarDirectory, mockAvatarName), join(uploadDirectory, avatarName));
      const avatar = join(this.getSubDirectoryUpload(), avatarName);

      const mockPageBackgroundDirectory = `${this.config().publicDirectory}/img/content/user-card-coach`;
      const mockPageBackgroundName = faker.helpers.arrayElement(readdirSync(mockPageBackgroundDirectory));
      const pageBackgroundName = `${randomUUID()}-${mockPageBackgroundName}`;
      copyFileSync(join(mockPageBackgroundDirectory, mockPageBackgroundName), join(uploadDirectory, pageBackgroundName));
      const pageBackground = join(this.getSubDirectoryUpload(), pageBackgroundName);

      const certificates = [];
      if (role === UserRole.Trainer) {
        const certificatesCount = randomInt(1, MockCertificate.Count + 1);
        for (let i = 1; i <= certificatesCount; i++) {
          const mockCertificateName = `${MockCertificate.Prefix}${i}${MockCertificate.Suffix}`;
          const certificateName = `${randomUUID()}-${mockCertificateName}`;
          copyFileSync(
            join(`${this.config().publicDirectory}/img/content/certificates-and-diplomas`, mockCertificateName),
            join(uploadDirectory, certificateName),
          );
          certificates.push(join(this.getSubDirectoryUpload(), certificateName));
        }
      }

      mockUsers.push({
        name: faker.person.fullName(),
        email: faker.internet.email(MOCK_EMAIL_OPTIONS),
        avatar,
        passwordHash: await hash(this.config().mockPassword, salt),
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
      });
    }

    return mockUsers;
  }

  private generateMockTrainings(mockUsers: UserModel[], count: number): Training[] {
    const mockTrainings: Training[] = [];
    const trainers = mockUsers.filter((user) => user.role == UserRole.Trainer);
    const uploadDirectory = join(this.config().uploadDirectory, this.getSubDirectoryUpload());

    if (!existsSync(uploadDirectory)) {
      mkdirSync(uploadDirectory, { recursive: true });
    }

    for (let i = 0; i < count; i++) {
      const user = faker.helpers.arrayElement(trainers);

      const mockBackgroundPictureDirectory = `${this.config().publicDirectory}/img/content/user-card-coach`;
      const mockBackgroundPictureName = faker.helpers.arrayElement(readdirSync(mockBackgroundPictureDirectory));
      const backgroundPictureName = `${randomUUID()}-${mockBackgroundPictureName}`;
      copyFileSync(join(mockBackgroundPictureDirectory, mockBackgroundPictureName), join(uploadDirectory, backgroundPictureName));
      const backgroundPicture = join(this.getSubDirectoryUpload(), backgroundPictureName);

      const mockVideoDirectory = `${this.config().publicDirectory}/img/content/training-video`;
      const mockVideoName = faker.helpers.arrayElement(['video-1.mp4']);
      const videoName = `${randomUUID()}-${mockVideoName}`;
      copyFileSync(join(mockVideoDirectory, mockVideoName), join(uploadDirectory, videoName));
      const video = join(this.getSubDirectoryUpload(), videoName);

      mockTrainings.push({
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
        userId: user.id,
        isSpecialOffer: faker.datatype.boolean(),
      });
    }

    return mockTrainings;
  }

  private generateMockReviews(users: UserModel[], trainings: TrainingModel[], count: number): Review[] {
    const mockReviews: Review[] = [];
    for (let i = 0; i < count; i++) {
      mockReviews.push({
        userId: faker.helpers.arrayElement(users).id,
        trainingId: faker.helpers.arrayElement(trainings).id,
        rating: faker.number.int({ min: RatingLimit.Min, max: RatingLimit.Max }),
        text: faker.commerce.productDescription(),
      });
    }
    return mockReviews;
  }

  private generateMockOrders(trainings: TrainingModel[], count: number): Order[] {
    const mockOrders: Order[] = [];
    for (let i = 0; i < count; i++) {
      const trainingId = trainings[i].id;
      const training = trainings[i];
      const amount = faker.number.int({ min: OrderAmountLimit.Min, max: OrderAmountLimit.Max });

      mockOrders.push({
        type: OrderType.Subscription,
        trainingId,
        price: training.price,
        amount,
        orderSum: training.price * amount,
        paymentMethod: faker.helpers.arrayElement(Object.values(OrderPaymentMethod)),
      });
    }
    return mockOrders;
  }

  private generateMockTrainingRequests(users: UserModel[], count: number): TrainingRequest[] {
    const mockRequests: TrainingRequest[] = [];
    for (let i = 0; i < count; i++) {
      let author = null;
      let target = null;

      while (!author) {
        const user = faker.helpers.arrayElement(users);
        if (user.role == UserRole.User) {
          author = user;
        }
      }

      while (!target) {
        const user = faker.helpers.arrayElement(users);
        if (user.id != author.id) {
          target = user;
        }
      }

      mockRequests.push({
        authorId: author.id,
        targetId: target.id,
        status: faker.helpers.arrayElement(Object.values(TrainingRequestStatus)),
      });
    }
    return mockRequests;
  }

  private generateMockNotifications(users: UserModel[], count: number): Notification[] {
    const mockNotifications: Notification[] = [];
    for (let i = 0; i < count; i++) {
      mockNotifications.push({
        userId: faker.helpers.arrayElement(users).id,
        text: faker.commerce.productDescription(),
      });
    }
    return mockNotifications;
  }

  private generateMockBalances(users: UserModel[], trainings: TrainingModel[], count: number): Balance[] {
    const mockBalances: Balance[] = [];
    for (let i = 0; i < count; i++) {
      mockBalances.push({
        userId: faker.helpers.arrayElement(users).id,
        trainingId: faker.helpers.arrayElement(trainings).id,
        available: faker.number.int({ min: BalanceAvailable.Min, max: BalanceAvailable.Max }),
      });
    }
    return mockBalances;
  }

  private async seedDb(prismaClient: PrismaClient, mockRecordsCount: number): Promise<void> {
    const mockUsers = await this.generateMockUsers(mockRecordsCount);
    const userDocuments = await Promise.all(
      mockUsers.map((user) => prismaClient.user.create({ data: user }))
    );

    const mockTrainings = this.generateMockTrainings(userDocuments, mockRecordsCount);
    const trainingDocuments = await Promise.all(
      mockTrainings.map((training) => prismaClient.training.create({ data: training }))
    );

    const mockReviews = this.generateMockReviews(userDocuments, trainingDocuments, mockRecordsCount);
    for (const review of mockReviews) {
      const training = await prismaClient.training.findFirst({ where: { id: review.trainingId } });
        const oldRating = training.rating;
        let updatedRating: number;

        if (!oldRating) {
          updatedRating = review.rating;
        } else {
          const existedReviewsCount = await prismaClient.review.count({ where: { trainingId: review.trainingId } });
          updatedRating = (oldRating * existedReviewsCount + review.rating) / (existedReviewsCount + 1);
        }
        training.rating = updatedRating;

        await prismaClient.training.update({ where: { id: review.trainingId }, data: training })
        await prismaClient.review.create({ data: review });
    }

    const mockOrders = this.generateMockOrders(trainingDocuments, mockRecordsCount);
    await prismaClient.order.createMany({ data: mockOrders });

    const mockRequests = this.generateMockTrainingRequests(userDocuments, mockRecordsCount);
    await prismaClient.trainingRequest.createMany({ data: mockRequests });

    const mockNotifications = this.generateMockNotifications(userDocuments, mockRecordsCount);
    await prismaClient.notification.createMany({ data: mockNotifications });

    const mockBalances = this.generateMockBalances(userDocuments, trainingDocuments, mockRecordsCount);
    await prismaClient.balance.createMany({ data: mockBalances });

    console.info(chalk.green(`Database filled with ${mockRecordsCount} records for each model`));
  }

  public getName(): string {
    return this.name;
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [n, connectionString] = parameters;

    try {
      if (!n || n.length == 0) {
        throw new Error('No <n> argument');
      }
      if (!connectionString || connectionString.length == 0) {
        throw new Error('no <connection string> argument');
      }
    } catch (error) {
      console.error(chalk.red("Can't generate data"));
      console.error(chalk.red(`Details: ${error.message}`));
      globalThis.process.exit(1);
    }

    const prismaClient = new PrismaClient({
      datasources: { db: { url: connectionString } },
    });

    try {
      const mockRecordsCount = Number.parseInt(n, 10);
      await this.seedDb(prismaClient, mockRecordsCount);
      globalThis.process.exit(0);
    } catch (error) {
      console.error(chalk.red("Can't generate data"));
      console.error(chalk.red(`Details: ${error.message}`));
      globalThis.process.exit(1);
    } finally {
      await prismaClient.$disconnect();
    }
  }
}

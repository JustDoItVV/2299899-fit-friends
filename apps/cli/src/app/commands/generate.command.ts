import { genSalt, hash } from 'bcrypt';
import chalk from 'chalk';

import {
  CaloriesPerDayLimit,
  CaloriesTargetLimit,
  METRO_STATIONS,
  MOCK_EMAIL_OPTIONS,
  MOCK_PASSWORD,
  OrderAmountLimit,
  PriceLimit,
  RatingLimit,
  SALT_ROUNDS,
  TRAINING_TYPE_LIMIT,
} from '@2299899-fit-friends/consts';
import {
  Balance,
  CliCommand,
  Notification,
  Order,
  OrderPaymentMethod,
  OrderType,
  RequestPersonalTraining,
  RequestPersonalTrainingStatus,
  Review,
  Training,
  TrainingAuditory,
  TrainingDuration,
  TrainingLevel,
  TrainingType,
  User,
  UserGender,
  UserRole,
} from '@2299899-fit-friends/types';
import { faker } from '@faker-js/faker';
import {
  PrismaClient,
  Training as TrainingModel,
  User as UserModel,
} from '@prisma/client';

export class GenerateCommand implements CliCommand {
  private readonly name = '--generate';

  private async generateMockUsers(count: number): Promise<User[]> {
    const salt = await genSalt(SALT_ROUNDS);
    const mockUsers: User[] = [];

    for (let i = 0; i < count; i++) {
      const role = i % 2 ? UserRole.Trainer : UserRole.User;
      mockUsers.push({
        name: faker.person.fullName(),
        email: faker.internet.email(MOCK_EMAIL_OPTIONS),
        avatar: faker.image.avatar(),
        passwordHash: await hash(MOCK_PASSWORD, salt),
        gender: faker.helpers.arrayElement(
          Object.values(UserGender)
        ) as UserGender,
        birthdate: faker.date.birthdate(),
        role,
        description: faker.person.bio(),
        location: faker.helpers.arrayElement(METRO_STATIONS),
        pageBackground: faker.image.url(),
        trainingLevel: faker.helpers.arrayElement(
          Object.values(TrainingLevel)
        ) as TrainingLevel,
        trainingType: faker.helpers.arrayElements(
          Object.values(TrainingType),
          TRAINING_TYPE_LIMIT
        ) as TrainingType[],
        trainingDuration:
          role == UserRole.User
            ? (faker.helpers.arrayElement(
                Object.values(TrainingDuration)
              ) as TrainingDuration)
            : TrainingDuration.Eighty,
        caloriesTarget:
          role == UserRole.User
            ? faker.number.int({
                min: CaloriesTargetLimit.Min,
                max: CaloriesTargetLimit.Max,
              })
            : CaloriesTargetLimit.Min,
        caloriesPerDay:
          role == UserRole.User
            ? faker.number.int({
                min: CaloriesPerDayLimit.Min,
                max: CaloriesPerDayLimit.Max,
              })
            : CaloriesPerDayLimit.Min,
        isReadyToTraining:
          role == UserRole.User ? faker.datatype.boolean() : false,
        certificate: role == UserRole.Trainer ? faker.image.url() : '',
        merits: faker.person.bio(),
        isReadyToPersonal:
          role == UserRole.Trainer ? faker.datatype.boolean() : false,
      });
    }

    return mockUsers;
  }

  private generateMockTrainings(
    mockUsers: UserModel[],
    count: number
  ): Training[] {
    const mockTrainings: Training[] = [];
    const trainers = mockUsers.filter((user) => user.role == UserRole.Trainer);

    for (let i = 0; i < count; i++) {
      const user = faker.helpers.arrayElement(trainers);
      mockTrainings.push({
        title: faker.commerce.productName(),
        backgroundPicture: faker.image.url(),
        level: faker.helpers.arrayElement(
          Object.values(TrainingLevel)
        ) as TrainingLevel,
        type: faker.helpers.arrayElement(
          Object.values(TrainingType)
        ) as TrainingType,
        duration: faker.helpers.arrayElement(
          Object.values(TrainingDuration)
        ) as TrainingDuration,
        price: faker.number.int({ min: PriceLimit.Min, max: PriceLimit.Max }),
        calories: faker.number.int({
          min: CaloriesTargetLimit.Min,
          max: CaloriesTargetLimit.Max,
        }),
        description: faker.commerce.productDescription(),
        gender: faker.helpers.arrayElement(
          Object.values(TrainingAuditory)
        ) as TrainingAuditory,
        video: faker.image.url(),
        userId: user.id,
        isSpecialOffer: faker.datatype.boolean(),
      });
    }

    return mockTrainings;
  }

  private generateMockReviews(
    users: UserModel[],
    trainings: TrainingModel[],
    count: number
  ): Review[] {
    const mockReviews: Review[] = [];
    for (let i = 0; i < count; i++) {
      mockReviews.push({
        userId: faker.helpers.arrayElement(users).id,
        trainingId: faker.helpers.arrayElement(trainings).id,
        rating: faker.number.int({
          min: RatingLimit.Min,
          max: RatingLimit.Max,
        }),
        text: faker.commerce.productDescription(),
      });
    }
    return mockReviews;
  }

  private generateMockOrders(
    trainings: TrainingModel[],
    count: number
  ): Order[] {
    const mockOrders: Order[] = [];
    for (let i = 0; i < count; i++) {
      mockOrders.push({
        type: OrderType.Subscription,
        trainingId: faker.helpers.arrayElement(trainings).id,
        price: faker.number.int({ min: PriceLimit.Min, max: PriceLimit.Max }),
        amount: faker.number.int({
          min: OrderAmountLimit.Min,
          max: OrderAmountLimit.Max,
        }),
        paymentMethod: faker.helpers.arrayElement(
          Object.values(OrderPaymentMethod)
        ),
      });
    }
    return mockOrders;
  }

  private generateMockRequestPersonalTraining(
    users: UserModel[],
    count: number
  ): RequestPersonalTraining[] {
    const mockRequests: RequestPersonalTraining[] = [];
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
        status: faker.helpers.arrayElement(
          Object.values(RequestPersonalTrainingStatus)
        ),
      });
    }
    return mockRequests;
  }

  private generateMockNotifications(
    users: UserModel[],
    count: number
  ): Notification[] {
    const mockNotifications: Notification[] = [];
    for (let i = 0; i < count; i++) {
      mockNotifications.push({
        sentDate: faker.date.recent(),
        userId: faker.helpers.arrayElement(users).id,
        text: faker.commerce.productDescription(),
      });
    }
    return mockNotifications;
  }

  private generateMockBalances(
    users: UserModel[],
    trainings: TrainingModel[],
    count: number
  ): Balance[] {
    const mockBalances: Balance[] = [];
    for (let i = 0; i < count; i++) {
      mockBalances.push({
        userId: faker.helpers.arrayElement(users).id,
        trainingId: faker.helpers.arrayElement(trainings).id,
        isAvailable: faker.datatype.boolean(),
      });
    }
    return mockBalances;
  }

  private async seedDb(
    prismaClient: PrismaClient,
    mockRecordsCount: number
  ): Promise<void> {
    const mockUsers = await this.generateMockUsers(mockRecordsCount);
    const userDocuments = await Promise.all(
      mockUsers.map((user) => prismaClient.user.create({ data: user }))
    );

    const mockTrainings = this.generateMockTrainings(
      userDocuments,
      mockRecordsCount
    );
    const trainingDocuments = await Promise.all(
      mockTrainings.map((training) =>
        prismaClient.training.create({ data: training })
      )
    );

    const mockReviews = this.generateMockReviews(
      userDocuments,
      trainingDocuments,
      mockRecordsCount
    );
    await Promise.all(
      mockReviews.map((review) => prismaClient.review.create({ data: review }))
    );

    const mockOrders = this.generateMockOrders(
      trainingDocuments,
      mockRecordsCount
    );
    await Promise.all(
      mockOrders.map((order) => prismaClient.order.create({ data: order }))
    );

    const mockRequests = this.generateMockRequestPersonalTraining(
      userDocuments,
      mockRecordsCount
    );
    await Promise.all(
      mockRequests.map((request) =>
        prismaClient.requestPersonalTraining.create({ data: request })
      )
    );

    const mockNotifications = this.generateMockNotifications(
      userDocuments,
      mockRecordsCount
    );
    await Promise.all(
      mockNotifications.map((notification) =>
        prismaClient.notification.create({ data: notification })
      )
    );

    const mockBalances = this.generateMockBalances(
      userDocuments,
      trainingDocuments,
      mockRecordsCount
    );
    await Promise.all(
      mockBalances.map((balance) =>
        prismaClient.balance.create({ data: balance })
      )
    );

    console.info(
      chalk.green(
        `Database filled with ${mockRecordsCount} records for each model`
      )
    );
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

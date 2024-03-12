import { compare, genSalt, hash } from 'bcrypt';

import { SALT_ROUNDS } from '@2299899-fit-friends/consts';
import {
  BaseEntity,
  TrainingDuration,
  TrainingLevel,
  TrainingType,
  User,
  UserGender,
  UserRole,
} from '@2299899-fit-friends/types';

export class UserEntity implements User, BaseEntity<string, User> {
  public id?: string;
  public name: string;
  public email: string;
  public avatar: string | undefined;
  public passwordHash: string;
  public gender: UserGender;
  public birthdate: Date | undefined;
  public role: UserRole;
  public description: string | undefined;
  public location: string;
  public pageBackground: string;
  public trainingLevel: TrainingLevel;
  public trainingType: TrainingType[];
  public trainingDuration: TrainingDuration | undefined;
  public caloriesTarget: number | undefined;
  public caloriesPerDay: number | undefined;
  public isReadyToTraining: boolean | undefined;
  public certificate: string | undefined;
  public merits: string | undefined;
  public isReadyToPersonal: boolean | undefined;
  public accessToken?: string;
  public refreshToken?: string;

  constructor(user: User) {
    this.populate(user);
  }

  public toPOJO(): User {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      passwordHash: this.passwordHash,
      gender: this.gender,
      birthdate: this.birthdate,
      role: this.role,
      description: this.description,
      location: this.location,
      pageBackground: this.pageBackground,
      trainingLevel: this.trainingLevel,
      trainingType: this.trainingType,
      trainingDuration: this.trainingDuration,
      caloriesTarget: this.caloriesTarget,
      caloriesPerDay: this.caloriesPerDay,
      isReadyToTraining: this.isReadyToTraining,
      certificate: this.certificate,
      merits: this.merits,
      isReadyToPersonal: this.isReadyToPersonal,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  }

  public populate(data: User): void {
    this.id = data.id ?? undefined;
    this.name = data.name;
    this.email = data.email;
    this.avatar = data.avatar;
    this.passwordHash = data.passwordHash;
    this.gender = data.gender;
    this.birthdate = data.birthdate;
    this.role = data.role;
    this.description = data.description;
    this.location = data.location;
    this.pageBackground = data.pageBackground;
    this.trainingLevel = data.trainingLevel;
    this.trainingType = data.trainingType;
    this.trainingDuration = data.trainingDuration;
    this.caloriesTarget = data.caloriesTarget;
    this.caloriesPerDay = data.caloriesPerDay;
    this.isReadyToTraining = data.isReadyToTraining;
    this.certificate = data.certificate;
    this.merits = data.merits;
    this.isReadyToPersonal = data.isReadyToPersonal;
    this.accessToken = data.accessToken ?? undefined;
    this.refreshToken = data.refreshToken ?? undefined;
  }

  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  static fromObject(data: User): UserEntity {
    return new UserEntity(data);
  }
}

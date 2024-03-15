import { compare, genSalt, hash } from 'bcrypt';

import { SALT_ROUNDS } from '@2299899-fit-friends/consts';
import { CreateUserDto } from '@2299899-fit-friends/dtos';
import {
    BaseEntity, TrainingDuration, TrainingLevel, TrainingType, User, UserGender, UserRole
} from '@2299899-fit-friends/types';

export class UserEntity implements User, BaseEntity<string, User> {
  public id?: string;
  public name: string;
  public email: string;
  public avatar: string | undefined;
  public passwordHash: string;
  public gender: UserGender;
  public birthdate?: Date;
  public role: UserRole;
  public description?: string;
  public location: string;
  public pageBackground: string;
  public trainingLevel: TrainingLevel;
  public trainingType: TrainingType[];
  public trainingDuration?: TrainingDuration;
  public caloriesTarget?: number;
  public caloriesPerDay?: number;
  public isReadyToTraining?: boolean;
  public certificate?: string;
  public merits?: string;
  public isReadyToPersonal?: boolean;
  public accessToken?: string;
  public refreshToken?: string;
  public createdAt?: Date;

  public toPOJO(): User {
    const userPojo = {
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
    };
    Object.assign(userPojo, this.trainingDuration === null ? null : { trainingDuration: this.trainingDuration });
    Object.assign(userPojo, this.caloriesTarget === null ? null : { caloriesTarget: this.caloriesTarget });
    Object.assign(userPojo, this.caloriesPerDay === null ? null : { caloriesPerDay: this.caloriesPerDay });
    Object.assign(userPojo, this.isReadyToTraining === null ? null : { isReadyToTraining: this.isReadyToTraining });
    Object.assign(userPojo, this.certificate === null ? null : { certificate: this.certificate });
    Object.assign(userPojo, this.merits === null ? null : { merits: this.merits });
    Object.assign(userPojo, this.isReadyToPersonal === null ? null : { isReadyToPersonal: this.isReadyToPersonal });
    Object.assign(userPojo, this.accessToken === null ? null : { accessToken: this.accessToken });
    Object.assign(userPojo, this.refreshToken === null ? null : { refreshToken: this.refreshToken });
    Object.assign(userPojo, this.createdAt === null ? null : { createdAt: this.createdAt });
    return userPojo;
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
    this.createdAt = data.createdAt ?? undefined;
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
    const entity = new UserEntity;
    entity.populate(data);
    return entity;
  }

  static fromDto(dto: CreateUserDto): UserEntity {
    const entity = new UserEntity();
    entity.name = dto.name;
    entity.email = dto.email;
    entity.gender = dto.gender;
    entity.birthdate = dto.birthdate;
    entity.role = dto.role;
    entity.description = dto.description;
    entity.location = dto.location;
    entity.trainingLevel = dto.trainingLevel;
    entity.trainingType = dto.trainingType;
    entity.trainingDuration = dto.role === UserRole.User ? dto.trainingDuration : undefined;
    entity.caloriesTarget = dto.role === UserRole.User ? dto.caloriesTarget : undefined;
    entity.caloriesPerDay = dto.role === UserRole.User ? dto.caloriesPerDay : undefined;
    entity.isReadyToTraining = dto.role === UserRole.User ? dto.isReadyToTraining : undefined;
    entity.merits = dto.role === UserRole.Trainer ? dto.merits : undefined;
    entity.isReadyToPersonal = dto.role === UserRole.Trainer ? dto.isReadyToPersonal : undefined;
    return entity;
  }
}

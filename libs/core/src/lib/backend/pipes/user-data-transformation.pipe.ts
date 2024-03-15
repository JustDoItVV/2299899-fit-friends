import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UserDataTrasformationPipe implements PipeTransform<Record<string, string>, Record<string, unknown>> {
  transform(value: Record<string, string>): Record<string, unknown> {
    const caloriesTarget = parseInt(value.caloriesTarget, 10);
    const caloriesPerDay = parseInt(value.caloriesPerDay, 10);
    const isReadyToTraining = value.isReadyToTraining === 'true';
    const isReadyToPersonal = value.isReadyToPersonal === 'true';
    let trainingType: unknown = value.trainingType;
    if (trainingType instanceof String) {
      trainingType = trainingType ? value.trainingType.split(',') : [];
    }

    return {
      ...value,
      caloriesTarget: caloriesTarget ? caloriesTarget : value.caloriesTarget,
      caloriesPerDay: caloriesPerDay ? caloriesPerDay : value.caloriesPerDay,
      isReadyToTraining,
      isReadyToPersonal,
      trainingType,
    };
  }
}

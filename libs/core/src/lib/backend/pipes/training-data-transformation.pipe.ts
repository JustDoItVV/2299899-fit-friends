import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrainingDataTrasformationPipe implements PipeTransform<Record<string, string>, Record<string, unknown>> {
  transform(value: Record<string, string>): Record<string, unknown> {
    const price = parseInt(value.price, 10);
    const calories = parseInt(value.calories, 10);
    const isSpecialOffer = value.isSpecialOffer === 'true';

    return {
      ...value,
      price: price ? price : undefined,
      calories: calories ? calories : undefined,
      isSpecialOffer,
    };
  }
}

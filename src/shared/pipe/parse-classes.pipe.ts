/* eslint-disable @typescript-eslint/ban-types */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class ParseClassesPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (value === undefined || value === null) {
      value = new metatype();
    }

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    try {
      await validateOrReject(object);
    } catch (errors) {
      throw new BadRequestException(errors);
    }
    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

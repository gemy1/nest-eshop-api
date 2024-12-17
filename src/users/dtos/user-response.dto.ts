import { Expose, Type } from 'class-transformer';
import { ReturnedUserDto } from './returned-user.dto';

export class UserResponseDto {
  @Expose()
  @Type(() => ReturnedUserDto)
  data: ReturnedUserDto[];

  @Expose()
  totalRecord: number;
}

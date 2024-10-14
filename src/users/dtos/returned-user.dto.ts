import { Expose } from 'class-transformer';

export class ReturnedUserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;
}

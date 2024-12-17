import { IsOptional, IsIn, IsInt, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsers {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsIn(['id', 'username', 'email', 'role'])
  orderBy?: 'id' | 'username' | 'email' | 'role';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  search?: string;
}

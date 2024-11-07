import { Expose } from 'class-transformer';

export class ImageResponseDto {
  @Expose()
  id: number;

  @Expose()
  path: string;
}

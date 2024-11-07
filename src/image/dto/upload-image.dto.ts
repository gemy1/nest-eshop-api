import { IsNotEmpty, IsString } from 'class-validator';

export class UploadImageDto {
  @IsString()
  @IsNotEmpty()
  imagePath: string;
}

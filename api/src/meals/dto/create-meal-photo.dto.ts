import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateMealPhotoDto {
  @ApiProperty({ description: 'Imagem do prato em base64, sem o prefixo data:' })
  @IsString()
  @IsNotEmpty()
  imageBase64!: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @Matches(/^image\/(jpeg|png|webp|heic|heif)$/)
  mimeType!: string;
}

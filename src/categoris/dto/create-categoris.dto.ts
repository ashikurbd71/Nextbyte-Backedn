import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategorisDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}

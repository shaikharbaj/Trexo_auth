/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class AdminLoginDto {

    @IsNotEmpty({ message: "Please enter email." })
    readonly email: string;

    @IsNotEmpty({ message: "Please enter password." })
    readonly password: string;
}

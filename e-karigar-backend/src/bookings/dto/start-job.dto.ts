import { IsNotEmpty, IsString, Length } from 'class-validator';

export class StartJobDto {
    @IsString()
    @IsNotEmpty()
    @Length(4, 4, { message: 'OTP must be exactly 4 digits' })
    otp: string;
}

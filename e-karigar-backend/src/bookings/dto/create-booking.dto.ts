import { IsNotEmpty, IsString, IsUUID, IsDateString, IsNumber, Min } from 'class-validator';

export class CreateBookingDto {
    @IsUUID()
    @IsNotEmpty()
    serviceId: string;

    @IsDateString()
    @IsNotEmpty()
    scheduledDate: string;

    @IsString()
    @IsNotEmpty()
    problemDescription: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNumber()
    @Min(0)
    totalPrice: number;
}

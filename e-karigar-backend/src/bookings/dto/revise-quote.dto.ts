import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ReviseQuoteDto {
    @IsNumber()
    @Min(0)
    new_price: number;

    @IsString()
    @IsNotEmpty()
    reason: string;
}

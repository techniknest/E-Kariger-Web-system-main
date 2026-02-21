import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ApproveRevisionDto {
    @IsBoolean()
    @IsNotEmpty()
    approved: boolean;
}

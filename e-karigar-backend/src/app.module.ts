import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ServicesModule } from './services/services.module';
import { VendorsModule } from './vendors/vendors.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [AuthModule, AdminModule, ServicesModule, VendorsModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
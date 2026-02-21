import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ServicesModule } from './services/services.module';
import { VendorsModule } from './vendors/vendors.module';
import { BookingsModule } from './bookings/bookings.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule, AdminModule, ServicesModule, VendorsModule, BookingsModule, CloudinaryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
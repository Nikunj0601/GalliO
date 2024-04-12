import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from './gallery.model';
import { UserModule } from 'src/user/user.module';
import { AWSServicesModule } from 'src/awsServices/awsServices.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gallery]),
    UserModule,
    AWSServicesModule,
    ConfigModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [],
})
export class GalleryModule {}

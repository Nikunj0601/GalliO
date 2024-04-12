import { Module } from '@nestjs/common';
import { AWSServicesService } from './awsServices.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [AWSServicesService],
  exports: [AWSServicesService],
})
export class AWSServicesModule {}

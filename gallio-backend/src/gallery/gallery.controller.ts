import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('photo')
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log(body.userId);

    return this.galleryService.uploadPhoto(
      body.userId,
      body.caption,
      file,
      body.isPublic,
    );
  }

  @Get('/user/:userId')
  async getPhotoByUserId(@Param() params: any) {
    console.log(params);

    return await this.galleryService.getPhotosByUserId(params.userId);
  }

  @Get('/:id')
  async getPhotoById(@Param() params: any) {
    return await this.galleryService.getPhotoById(params.id);
  }

  @Get('/')
  async getAllPhotos() {
    return await this.galleryService.getAllPhotos();
  }
}

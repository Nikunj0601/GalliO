import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gallery } from './gallery.model';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { AWSServicesService } from 'src/awsServices/awsServices.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GalleryService {
  private readonly AWS_S3_BUCKET: string;
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
    private readonly userService: UserService,
    private readonly awsServicesService: AWSServicesService,
    private readonly configService: ConfigService,
  ) {
    this.AWS_S3_BUCKET = this.configService.get('awsS3.bucket');
  }

  filePath(user: User, file: Express.Multer.File) {
    return `photos/${user.firstName}_${user.lastName}/${file.originalname}`;
  }

  async uploadPhoto(
    userId: number,
    caption: string,
    file: Express.Multer.File,
    isPublic: boolean,
  ) {
    const user = await this.userService.getUserById(userId);
    console.log(user);

    console.log(isPublic, typeof isPublic);

    const filepath = this.filePath(user, file);

    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: filepath,
      Body: file.buffer,
    };

    await this.awsServicesService.uploadPhotoToS3(params);

    const moderatedLabels =
      await this.awsServicesService.detectModerationLabelsFromImage(filepath);
    if (moderatedLabels.length) {
      const message = `Moderation labels detected: ${moderatedLabels.map((label) => label).join(', ')}`;
      await this.awsServicesService.sendEmailSNS(
        'nikunjhudka123@gmail.com',
        message,
      );
    }
    const galleryPhoto = {
      path: filepath,
      user: user.id,
      caption: caption,
      isPublic:
        isPublic.toString() == 'true' || isPublic == true ? true : false,
      moderated: moderatedLabels.length ? true : false,
    };
    return this.galleryRepository.save(galleryPhoto);
  }

  async getPhotoById(id: number): Promise<Gallery> {
    const photo: Gallery = await this.galleryRepository.findOneBy({ id: id });
    const cloudfrontDomainName =
      await this.awsServicesService.getCloudFrontDomainName();
    console.log(cloudfrontDomainName);
    const downloadUrl = `https://${cloudfrontDomainName.Distribution.DomainName}/${photo.path}`;
    // const downloadUrl = await this.awsServicesService.getPresignedUrl(photo);
    return {
      ...photo,
      downloadUrl,
    };
  }

  async getPhotosByUserId(id: number): Promise<Gallery[]> {
    const photos: Gallery[] = await this.galleryRepository.find({
      where: { user: id },
      relations: {
        user: true,
      },
    });
    const cloudfrontDomainName =
      await this.awsServicesService.getCloudFrontDomainName();

    const photosWithDownloadUrls = await Promise.all(
      photos.map(async (photo) => {
        const downloadUrl: string = `https://${cloudfrontDomainName.Distribution.DomainName}/${photo.path}`;
        return { ...photo, downloadUrl };
      }),
    );
    return photosWithDownloadUrls;
  }

  async getAllPhotos(): Promise<Gallery[]> {
    const photos: Gallery[] = await this.galleryRepository.find({
      where: { isPublic: true },
      relations: { user: true },
    });
    const cloudfrontDomainName =
      await this.awsServicesService.getCloudFrontDomainName();

    const photosWithDownloadUrls = await Promise.all(
      photos.map(async (photo) => {
        const downloadUrl: string = `https://${cloudfrontDomainName.Distribution.DomainName}/${photo.path}`;
        return { ...photo, downloadUrl };
      }),
    );
    return photosWithDownloadUrls;
  }
}

# Gallio: Innovative Photo Sharing Platform

## Project Overview

GalliO is an innovative web application designed to allow users to share their photos with
others through an intuitive and user-friendly interface. With features like captioning, privacy
settings, content moderation, and seamless integration with AWS services, GalliO offers a
secure and engaging platform for sharing precious moments.

## Key Features

### 1. Photo Sharing
- Easy photo uploading with caption support
- Seamless user experience for sharing life moments

### 2. Advanced Privacy Controls
- Flexible visibility settings
- Choose between public and private photo sharing
- Granular control over content visibility

### 3. Intelligent Content Moderation
- Automatic content screening using Amazon Rekognition
- Real-time detection of inappropriate or sensitive images
- Proactive safety measures for user protection

### 4. Enhanced User Safety
- Blurred content preview on explore page
- Admin email notifications for moderated content
- Viewer consent required for sensitive images

## Technical Architecture

### Frontend
- **Framework**: React
- **Key Libraries**: 
  - React Router for navigation
  - Axios for API communication
  - State management library

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: SQLite

### Cloud Infrastructure
- **Deployment**: 
  - AWS EC2
  - AWS Elastic Beanstalk
- **Storage**: 
  - Amazon S3
- **Content Delivery**: 
  - Amazon CloudFront
- **Security & Management**:
  - AWS Secrets Manager
  - AWS CloudFormation (Infrastructure as Code)

### Additional AWS Services
- **Image Processing**: Amazon Rekognition
- **Notifications**: Amazon SNS (Simple Notification Service)

## Security Features

### Content Moderation Workflow
1. Image Upload
2. Amazon Rekognition Analysis
3. Automatic Flagging
4. Admin Notification
5. Conditional Content Display

### Privacy Protections
- Private photo isolation
- Consent-based sensitive content viewing
- Automated inappropriate content detection

## Deployment

### AWS Infrastructure
- Deployed using AWS CloudFormation
- Automated resource provisioning
- Scalable and reproducible infrastructure

### AWS Architecture
![image](https://github.com/user-attachments/assets/f46fae46-677a-439b-a465-8cc61d9d63b5)





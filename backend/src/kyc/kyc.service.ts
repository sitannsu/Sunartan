import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RequestKycDocumentDto, UploadKycDocumentDto, UpdateKycStatusDto } from './kyc.dto';

@Injectable()
export class KycService {
  constructor(private prisma: PrismaService) {}

  async requestDocument(dto: RequestKycDocumentDto) {
    const profile = await this.prisma.artisanProfile.findUnique({
      where: { id: dto.artisanProfileId },
    });
    if (!profile) {
      throw new NotFoundException('Artisan profile not found.');
    }

    return this.prisma.kycDocument.create({
      data: {
        artisanProfileId: dto.artisanProfileId,
        documentType: dto.documentType,
        status: 'REQUESTED',
      },
    });
  }

  async submitDocument(userId: string, documentType: string, fileUrl: string, fileName: string) {
    const profile = await this.prisma.artisanProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException('Artisan profile not found.');
    }

    // Check if there is an existing REQUESTED or REJECTED document of the same type
    const existing = await this.prisma.kycDocument.findFirst({
      where: {
        artisanProfileId: profile.id,
        documentType,
        status: { in: ['REQUESTED', 'REJECTED'] },
      },
    });

    if (existing) {
      return this.prisma.kycDocument.update({
        where: { id: existing.id },
        data: {
          fileUrl,
          fileName,
          status: 'PENDING',
          updatedAt: new Date(),
        },
      });
    }

    return this.prisma.kycDocument.create({
      data: {
        artisanProfileId: profile.id,
        documentType,
        fileUrl,
        fileName,
        status: 'PENDING',
      },
    });
  }

  async getMyDocuments(userId: string) {
    const profile = await this.prisma.artisanProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException('Artisan profile not found.');
    }

    return this.prisma.kycDocument.findMany({
      where: { artisanProfileId: profile.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllDocuments() {
    return this.prisma.kycDocument.findMany({
      include: {
        artisanProfile: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateDocumentStatus(id: string, dto: UpdateKycStatusDto) {
    const doc = await this.prisma.kycDocument.findUnique({
      where: { id },
    });
    if (!doc) {
      throw new NotFoundException('KYC document not found.');
    }

    return this.prisma.kycDocument.update({
      where: { id },
      data: {
        status: dto.status,
        adminNote: dto.adminNote || null,
        reviewedAt: new Date(),
      },
    });
  }
}

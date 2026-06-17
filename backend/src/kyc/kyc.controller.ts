import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { KycService } from './kyc.service';
import { RequestKycDocumentDto, UploadKycDocumentDto, UpdateKycStatusDto } from './kyc.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('kyc')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('request')
  @Roles(Role.ADMIN)
  async requestDocument(@Body() dto: RequestKycDocumentDto) {
    return this.kycService.requestDocument(dto);
  }

  @Post('submit')
  @Roles(Role.ARTISAN)
  async submitDocument(
    @Request() req: any,
    @Body() dto: Omit<UploadKycDocumentDto, 'documentId'> & { documentType: string },
  ) {
    return this.kycService.submitDocument(
      req.user.id,
      dto.documentType,
      dto.fileUrl,
      dto.fileName,
    );
  }

  @Get('my')
  @Roles(Role.ARTISAN)
  async getMyDocuments(@Request() req: any) {
    return this.kycService.getMyDocuments(req.user.id);
  }

  @Get('all')
  @Roles(Role.ADMIN)
  async getAllDocuments() {
    return this.kycService.getAllDocuments();
  }

  @Put(':id/status')
  @Roles(Role.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateKycStatusDto,
  ) {
    return this.kycService.updateDocumentStatus(id, dto);
  }
}

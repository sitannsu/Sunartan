import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export class RequestKycDocumentDto {
  @IsNotEmpty()
  @IsString()
  artisanProfileId: string;

  @IsNotEmpty()
  @IsString()
  documentType: string; // e.g. "NATIONAL_ID", "BANK_STATEMENT", "TAX_REGISTRATION", "OTHER"
}

export class UploadKycDocumentDto {
  @IsNotEmpty()
  @IsString()
  documentId: string;

  @IsNotEmpty()
  @IsString()
  fileUrl: string;

  @IsNotEmpty()
  @IsString()
  fileName: string;
}

export class UpdateKycStatusDto {
  @IsNotEmpty()
  @IsEnum(['APPROVED', 'REJECTED'])
  status: string;

  @IsOptional()
  @IsString()
  adminNote?: string;
}

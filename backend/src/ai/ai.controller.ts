import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('consult')
  async consult(@Request() req: any, @Body('text') text: string, @Body('conversationId') conversationId?: string) {
    return this.aiService.consult(text, conversationId);
  }

  @Post('studio/plan')
  async planStudio(@Body('theme') theme: string) {
    return this.aiService.planStudioCollection(theme);
  }

  @Get('conversation')
  async getConversation(@Request() req: any) {
    return this.aiService.getConversationHistory(req.user.id);
  }
}

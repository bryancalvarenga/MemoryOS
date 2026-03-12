import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { DocumentsService } from "./documents.service";

type AuthenticatedRequest = {
  user: {
    userId: string;
    email: string;
  };
};

@Controller("/api/v1/documents")
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body()
    body: {
      title: string;
      sourceType: string;
      filePath?: string;
    },
  ) {
    return this.documentsService.create({
      userId: request.user.userId,
      title: body.title,
      sourceType: body.sourceType,
      filePath: body.filePath ?? null,
    });
  }

  @Get()
  list(@Req() request: AuthenticatedRequest) {
    return this.documentsService.findAll(request.user.userId);
  }

  @Get(":id")
  get(@Req() request: AuthenticatedRequest, @Param("id") id: string) {
    return this.documentsService.findById(request.user.userId, id);
  }

  @Delete(":id")
  delete(@Req() request: AuthenticatedRequest, @Param("id") id: string) {
    return this.documentsService.delete(request.user.userId, id);
  }
}

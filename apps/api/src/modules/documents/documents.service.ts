import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DocumentEntity } from "./document.entity";

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentsRepository: Repository<DocumentEntity>,
  ) {}

  async create(data: {
    userId: string;
    title: string;
    sourceType: string;
    filePath?: string | null;
  }) {
    const document = this.documentsRepository.create({
      userId: data.userId,
      title: data.title,
      sourceType: data.sourceType,
      filePath: data.filePath ?? null,
    });

    return this.documentsRepository.save(document);
  }

  async findAll(userId: string) {
    return this.documentsRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  async findById(userId: string, id: string) {
    return this.documentsRepository.findOne({
      where: { id, userId },
    });
  }

  async delete(userId: string, id: string) {
    await this.documentsRepository.delete({
      id,
      userId,
    });

    return { deleted: true };
  }
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "documents" })
export class DocumentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ name: "source_type", type: "varchar", length: 50 })
  sourceType!: string;

  @Column({ name: "file_path", type: "text", nullable: true })
  filePath!: string | null;

  @Column({
    name: "processing_status",
    type: "varchar",
    length: 50,
    default: "pending",
  })
  processingStatus!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * Entidade que representa a tabela de usuários do sistema.
 *
 * No TypeORM, cada entidade mapeia diretamente para uma tabela
 * no banco de dados. As propriedades da classe representam
 * colunas da tabela.
 *
 * Esta entidade será a base para autenticação e identidade
 * dentro do MemoryOS.
 */
@Entity({ name: "users" })
export class UserEntity {
  /**
   * Identificador único do usuário.
   *
   * UUID é usado em vez de integer incremental porque:
   * - evita enumeração previsível de usuários
   * - facilita sistemas distribuídos
   * - é mais seguro para exposição em APIs
   */
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /**
   * Email do usuário.
   *
   * - limitado a 255 caracteres (padrão comum)
   * - unique garante que dois usuários não possam
   *   se registrar com o mesmo email
   */
  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  /**
   * Hash da senha do usuário.
   *
   * Importante: nunca armazenamos senha em texto puro.
   * O valor armazenado aqui deve ser gerado por um algoritmo
   * seguro como:
   *
   * - bcrypt
   * - argon2
   *
   * O campo é `text` para evitar limitações de tamanho
   * dependendo do algoritmo utilizado.
   */
  @Column({ name: "password_hash", type: "text" })
  passwordHash!: string;

  /**
   * Timestamp de criação do registro.
   *
   * O TypeORM preenche automaticamente esse campo
   * no momento da inserção no banco.
   */
  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  /**
   * Timestamp da última atualização do registro.
   *
   * Atualizado automaticamente sempre que
   * o registro sofre alteração.
   */
  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;

  /**
   * Hook executado automaticamente antes de:
   * - INSERT
   * - UPDATE
   *
   * Serve para garantir consistência no armazenamento
   * do email no banco.
   *
   * Normalizações aplicadas:
   * - remove espaços acidentais
   * - converte para lowercase
   *
   * Isso evita problemas como:
   * "User@Email.com"
   * " user@email.com "
   * serem tratados como usuários diferentes.
   */
  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    this.email = this.email.trim().toLowerCase();
  }
}

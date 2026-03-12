import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";

/**
 * Service responsável pela lógica de acesso e manipulação
 * de dados relacionados a usuários.
 *
 * No padrão arquitetural do NestJS:
 *
 * Controller → Service → Repository → Database
 *
 * Ou seja, o Service centraliza regras de negócio e evita
 * que controllers manipulem o banco diretamente.
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Injeta o repositório do TypeORM para a entidade UserEntity.
     *
     * O Repository fornece métodos de acesso ao banco como:
     * - find
     * - findOne
     * - save
     * - delete
     * - update
     */
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  /**
   * Busca um usuário pelo email.
   *
   * A normalização do email é feita aqui para garantir
   * consistência na busca (mesma lógica aplicada na entidade).
   *
   * Isso evita problemas como:
   * - USER@email.com
   * - user@email.com
   * - " user@email.com "
   */
  findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email: email.trim().toLowerCase() },
    });
  }

  /**
   * Busca um usuário pelo ID (UUID).
   *
   * Esse método é normalmente usado por:
   * - autenticação JWT
   * - recuperação de perfil
   * - verificações internas da aplicação
   */
  findById(id: string) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  /**
   * Cria um novo usuário no sistema.
   *
   * Espera receber:
   * - email
   * - passwordHash (já processado por bcrypt/argon2)
   *
   * Importante:
   * Este método não deve receber senha em texto puro.
   * O hash deve ser gerado previamente no fluxo de autenticação.
   */
  create(data: { email: string; passwordHash: string }) {
    /**
     * Cria uma instância da entidade baseada nos dados recebidos.
     * Ainda não persiste no banco.
     */
    const user = this.usersRepository.create({
      email: data.email,
      passwordHash: data.passwordHash,
    });

    /**
     * Persiste o usuário no banco.
     *
     * O TypeORM executará:
     * - hooks da entidade (ex: normalizeEmail)
     * - geração de UUID
     * - criação automática de timestamps
     */
    return this.usersRepository.save(user);
  }
}

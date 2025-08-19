import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with phone already exists
    const existingUser = await this.userRepository.findOne({
      where: { phone: createUserDto.phone }
    });

    if (existingUser) {
      throw new BadRequestException('User with this phone number already exists');
    }

    // Check if email is provided and unique
    if (createUserDto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: createUserDto.email }
      });

      if (existingEmail) {
        throw new BadRequestException('User with this email already exists');
      }
    }

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findActiveUsers(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isActive: true, isBanned: false },
      order: { createdAt: 'DESC' }
    });
  }

  async findBannedUsers(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isBanned: true },
      order: { bannedAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByPhone(phone: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { phone }
    });

    if (!user) {
      throw new NotFoundException(`User with phone ${phone} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Check if email is being updated and if it's unique
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email }
      });

      if (existingEmail) {
        throw new BadRequestException('User with this email already exists');
      }
    }

    // Check if phone is being updated and if it's unique
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingPhone = await this.userRepository.findOne({
        where: { phone: updateUserDto.phone }
      });

      if (existingPhone) {
        throw new BadRequestException('User with this phone number already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async updateProfileImage(id: number, photoUrl: string): Promise<User> {
    const user = await this.findOne(id);

    user.photoUrl = photoUrl;
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async banUser(id: number, banUserDto: BanUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (user.isBanned) {
      throw new BadRequestException('User is already banned');
    }

    user.isBanned = true;
    user.isActive = false;
    user.banReason = banUserDto.reason;
    user.bannedAt = new Date();

    return await this.userRepository.save(user);
  }

  async unbanUser(id: number): Promise<User> {
    const user = await this.findOne(id);

    if (!user.isBanned) {
      throw new BadRequestException('User is not banned');
    }

    user.isBanned = false;
    user.isActive = true;
    user.banReason = null;
    user.bannedAt = null;

    return await this.userRepository.save(user);
  }

  async activateUser(id: number): Promise<User> {
    const user = await this.findOne(id);

    if (user.isActive) {
      throw new BadRequestException('User is already active');
    }

    if (user.isBanned) {
      throw new BadRequestException('Cannot activate a banned user. Unban the user first.');
    }

    user.isActive = true;
    return await this.userRepository.save(user);
  }

  async deactivateUser(id: number): Promise<User> {
    const user = await this.findOne(id);

    if (!user.isActive) {
      throw new BadRequestException('User is already inactive');
    }

    user.isActive = false;
    return await this.userRepository.save(user);
  }

  async verifyUser(id: number): Promise<User> {
    const user = await this.findOne(id);

    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    user.isVerified = true;
    return await this.userRepository.save(user);
  }

  async getUsersStats(): Promise<{
    total: number;
    active: number;
    banned: number;
    verified: number;
    unverified: number;
  }> {
    const [total, active, banned, verified, unverified] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isActive: true, isBanned: false } }),
      this.userRepository.count({ where: { isBanned: true } }),
      this.userRepository.count({ where: { isVerified: true } }),
      this.userRepository.count({ where: { isVerified: false } }),
    ]);

    return { total, active, banned, verified, unverified };
  }
}

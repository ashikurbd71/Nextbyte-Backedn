import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpStatus, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { BanUserDto } from './dto/ban-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.usersService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('active/list')
  @HttpCode(HttpStatus.OK)
  findActiveUsers() {
    return this.usersService.findActiveUsers();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('banned/list')
  @HttpCode(HttpStatus.OK)
  findBannedUsers() {
    return this.usersService.findBannedUsers();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('stats/overview')
  @HttpCode(HttpStatus.OK)
  getUsersStats() {
    return this.usersService.getUsersStats();
  }

  // @UseGuards(JwtAuthGuard)
  @Post('ban/:id')
  @HttpCode(HttpStatus.OK)
  banUser(@Param('id') id: string, @Body() banUserDto: BanUserDto) {
    return this.usersService.banUser(+id, banUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('unban/:id')
  @HttpCode(HttpStatus.OK)
  unbanUser(@Param('id') id: string) {
    return this.usersService.unbanUser(+id);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('activate/:id')
  @HttpCode(HttpStatus.OK)
  activateUser(@Param('id') id: string) {
    return this.usersService.activateUser(+id);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('deactivate/:id')
  @HttpCode(HttpStatus.OK)
  deactivateUser(@Param('id') id: string) {
    return this.usersService.deactivateUser(+id);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('verify/:id')
  @HttpCode(HttpStatus.OK)
  verifyUser(@Param('id') id: string) {
    return this.usersService.verifyUser(+id);
  }
}

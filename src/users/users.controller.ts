import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiOkResponse({
    description: 'The currently signed in user is returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @ApiResponse({
    status: 201,
    description: 'The currently signed in user is successfully signed out',
  })
  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @ApiResponse({
    status: 201,
    description: 'A user is created successfully and is signed in',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Email is malformed' })
  @ApiBadRequestResponse({
    description: 'Email already in use',
  })
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @ApiResponse({
    status: 201,
    description: 'The user is successfully signed in',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Email is malformed' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Post('/signin')
  async signinUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @ApiOkResponse({
    description: 'The user is returned successfully',
    type: User,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @ApiOkResponse({
    description: 'Users with the provided email are returned successfully',
    type: User,
    isArray: true,
  })
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @ApiOkResponse({
    description: 'The user is updated successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Email is malformed' })
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @ApiOkResponse({
    description: 'The user is deleted successfully',
    type: User,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}

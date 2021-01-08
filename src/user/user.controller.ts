import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { User } from './user.decorator';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/users')
  @UseGuards(new AuthGuard())
  showAllUser(@Query('page') page: number) {
    return this.userService.showAll(page);
  }

  @Get('auth/whoami')
  @UseGuards(new AuthGuard())
  whoAmI(@User('username') username: string) {
    return this.userService.read(username);
  }

  @Post('auth/login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }

  @Post('auth/register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDTO) {
    return this.userService.register(data);
  }
}

import { Body, Controller, Post, Session } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { LoginDTO } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDTO, @Session() session: any) {
    return this.authService.login(body, session);
  }
}

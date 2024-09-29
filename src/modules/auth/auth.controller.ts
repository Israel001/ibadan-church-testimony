import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { LocalAuthGuard } from "src/guards/local-auth-guard";
import { LoginDTO } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Body() _body: LoginDTO, @Req() req: any) {
    return this.authService.login(req.user);
  }
}

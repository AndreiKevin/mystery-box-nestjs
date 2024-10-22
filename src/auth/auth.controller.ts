import { Controller, Post, Body } from "@nestjs/common";
import type { AuthService } from "./auth.service";
import type { RegisterDto } from "./dto/register.dto";
import type { LoginDto } from "./dto/login.dto";

@Controller("api/v1/auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return { success: true, data: result };
  }

	@Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return { success: true, data: result };
  }
}

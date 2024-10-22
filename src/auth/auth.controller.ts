import { Controller, Post, Body } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <this is not used as a type. nestjs needs it to be imported as a class>
import { AuthService } from "./auth.service";
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

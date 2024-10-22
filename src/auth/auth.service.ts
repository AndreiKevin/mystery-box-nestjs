import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { User } from "../users/user.entity";
import type { RegisterDto } from "./dto/register.dto";
import type { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
	constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

	async register(registerDto: RegisterDto) {
		const queryRunner =
			this.userRepository.manager.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const result = await queryRunner.query("CALL RegisterUser(?, ?, ?, ?)", [
				registerDto.username,
				registerDto.email,
				await bcrypt.hash(registerDto.password, 10),
				registerDto.referralCode,
			]);

			const newUser = result[0][0];
			const token = this.generateToken(newUser);

			await queryRunner.commitTransaction();

			return {
				userId: newUser.id,
				username: newUser.username,
				email: newUser.email,
				referralCode: newUser.referral_code,
				credits: newUser.credits,
				token,
			};
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	async login(loginDto: LoginDto) {
		const user = await this.userRepository.findOne({
			where: { email: loginDto.email },
		});

		if (
			!user ||
			!(await bcrypt.compare(loginDto.password, user.password_hash))
		) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const token = this.generateToken(user);

		return {
			userId: user.id,
			username: user.username,
			email: user.email,
			referralCode: user.referral_code,
			credits: user.credits,
			token,
		};
	}

	private generateToken(user: User): string {
		const payload: JwtPayload = { userId: user.id, email: user.email };
		return jwt.sign(
			payload,
			process.env.JWT_SECRET || "your-secret-key",
			{ expiresIn: "1d" },
		);
	}
}

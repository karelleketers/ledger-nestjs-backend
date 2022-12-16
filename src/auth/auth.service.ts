import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthHelper } from './auth.helper';
import { AuthInput } from './dto/auth.input';
import { JwtToken } from './models/jwt-token';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService, private readonly authHelper: AuthHelper) {}

    async validate(email: string, pass: string): Promise<any> {
        try {const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new NotFoundException(`User with email ${email} does not exist`)
        }

        const passwordIsValid = await this.authHelper.validate(pass, user.password);

        if (!passwordIsValid) {
            throw new Error ('Invalid password')
        }
        const { password, ...rest } = user
        return rest;
        } catch (err) {
            throw err
        }
    }

    async login(user: any): Promise<JwtToken>   {
        try { const payload = {
            sub: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
            profileId: (user.profile ? user.profile.id : ""),
            onboarding: (user.profile? user.profile.onboarding : "")
        }

        return {
            token: this.jwtService.sign(payload),
          };
        } catch (err) {
            throw err
        }
    };

    async refreshToken(userId: number): Promise<JwtToken> {
        try { const user = await this.usersService.findOne(userId);
        const payload = {
            sub: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
            profileId: (user.profile ? user.profile.id : ""),
            onboarding: (user.profile? user.profile.onboarding : "")
        }

        return {
            token: this.jwtService.sign(payload),
          };
        } catch (err) {
            throw err
        }
    }

    async register(input: AuthInput): Promise<User> {
        try {
        const found = await this.usersService.findByEmail(input.email);
        if (found) {
            throw new Error ('User with this email already exists')
        }
        const user = await this.usersService.createUser(input);
        return user;
        } catch (err) {
            throw err
        }
        
    }
}

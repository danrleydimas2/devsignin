import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'
import { AuthService } from 'src/auth/auth.service';
import { User } from './users.model.ts/users.model';
import { Model } from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User')
        private readonly usersModel: Model<User>,

        private readonly authService: AuthService
    ) { }

    public async signup(SignupDto: SignupDto): Promise<User> {
        const user = new this.usersModel(SignupDto);
        return user.save()
    }

    public async signin(signinDto: SigninDto): Promise<{ name: string; jwtToken: string; email: string }> {
        const user = await this.findByEmail(signinDto.email)
        const match = await this.checkPassword(signinDto.password, user)
        if (!match) {
            throw new NotFoundException('Invalid credentials')
        }
        if (!user) {
            throw new NotFoundException('User no exist')
        }
        const jwtToken = await this.authService.createAccesToken(user.id)
        return { name: user.name, jwtToken, email: user.email }
    }
    
    public async findAll(): Promise<User[]> {
        return this.usersModel.find()
    }

    private async findByEmail(email: string): Promise<User> {
        const user = await this.usersModel.findOne({ email })

        if (!user) {
            throw new NotFoundException('Email not found');
        }
        return user;
    }

    private async checkPassword(password: string, user: User): Promise<boolean> {
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            throw new NotFoundException('Password not found')
        }
        return match
    }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserInput, LoginInput, AuthResponse } from './dto/user.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SoapService } from '../soap/soap.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        private soapService: SoapService,
    ) {}

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async create(createUserInput: CreateUserInput): Promise<User> {
        const { password, ...rest } = createUserInput;
        
        // Check if user already exists
        const existingUser = await this.findByUsername(createUserInput.username);
        if (existingUser) {
            throw new Error('User with this username already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create and save the new user
        const user = this.usersRepository.create({
            ...rest,
            password: hashedPassword,
        });
        
        return this.usersRepository.save(user);
    }

    async login(loginInput: LoginInput): Promise<AuthResponse> {
        const { username, password } = loginInput;
        
        // Try to authenticate via SOAP first
        try {
            const isValidSoap = await this.authenticateViaSoap(username, password);
            if (isValidSoap) {
                // If SOAP auth is successful but user doesn't exist locally, create them
                let user = await this.findByUsername(username);
                if (!user) {
                    user = await this.create({
                        username,
                        password, // Will be hashed in create method
                        fullName: username, // Default fullName to username for SOAP users
                    });
                }
                
                // Generate JWT token
                const payload = { username: user.username, sub: user.id };
                const { password: _, ...userWithoutPassword } = user;
                
                return {
                    access_token: this.jwtService.sign(payload),
                    user: userWithoutPassword as any,
                };
            }
        } catch (error) {
            // If SOAP auth fails, continue to local auth
            console.log('SOAP authentication failed, trying local auth:', error.message);
        }
        
        // Local authentication
        const user = await this.findByUsername(username);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        // Generate JWT token
        const payload = { username: user.username, sub: user.id };
        const { password: _, ...userWithoutPassword } = user;
        
        return {
            access_token: this.jwtService.sign(payload),
            user: userWithoutPassword as any,
        };
    }

    private async authenticateViaSoap(username: string, password: string): Promise<boolean> {
        return this.soapService.authenticate(username, password);
    }
}
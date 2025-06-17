import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: 'your-secret-key', // In production, use environment variables
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [JwtStrategy],
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { JwtModule } from '@nestjs/jwt';
import { SoapModule } from 'src/soap/soap.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: 'your-secret-key', // In production, use environment variables
            signOptions: { expiresIn: '1h' },
        }),
        SoapModule,
        TasksModule,
    ],
    providers: [UsersService, UsersResolver],
    exports: [UsersService],
})
export class UsersModule {}
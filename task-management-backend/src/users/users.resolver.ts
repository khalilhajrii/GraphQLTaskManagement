import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { TasksService } from '../tasks/tasks.service';
import { User } from './user.entity';
import { CreateUserInput, LoginInput, AuthResponse } from './dto/user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private usersService: UsersService,
        private tasksService: TasksService
    ) {}

    @Query(() => [User])
    @UseGuards(JwtAuthGuard)
    users(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Query(() => User, { nullable: true })
    @UseGuards(JwtAuthGuard)
    user(@Args('id', { type: () => ID }) id: number): Promise<User | null> {
        return this.usersService.findOne(id);
    }

    @Query(() => User, { nullable: true })
    @UseGuards(JwtAuthGuard)
    me(@CurrentUser() user: User): User {
        return user;
    }

    @Mutation(() => User)
    createUser(@Args('input') input: CreateUserInput): Promise<User> {
        return this.usersService.create(input);
    }

    @Mutation(() => AuthResponse)
    login(@Args('input') input: LoginInput): Promise<AuthResponse> {
        return this.usersService.login(input);
    }

    @ResolveField()
    async tasks(@Parent() user: User) {
        return this.tasksService.findByUser(user.id);
    }
}
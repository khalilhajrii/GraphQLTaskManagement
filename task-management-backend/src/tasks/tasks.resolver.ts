import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { CreateTaskInput, UpdateTaskInput } from './dto/task.input';

@Resolver(() => Task)
export class TasksResolver {
    constructor(private tasksService: TasksService) { }

    @Query(() => [Task])
    tasks(): Promise<Task[]> {
        return this.tasksService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Query(() => [Task])
    myTasks(@CurrentUser() user: User): Promise<Task[]> {
        return this.tasksService.findByUser(user.id);
    }

    @Query(() => Task)
    task(@Args('id', { type: () => ID }) id: number): Promise<Task | null> {
        return this.tasksService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Task)
    createTask(
        @Args('input') input: CreateTaskInput,
        @CurrentUser() user: User
    ): Promise<Task> {
        // Override userId with the current user's id for security
        return this.tasksService.create({
            ...input,
            userId: user.id
        });
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Task)
    updateTask(
        @Args('id', { type: () => ID }) id: number,
        @Args('input') input: UpdateTaskInput,
        @CurrentUser() user: User
    ): Promise<Task | null> {
        // First check if the task belongs to the user
        return this.tasksService.findOne(id).then(task => {
            if (!task || task.userId !== user.id) {
                throw new Error('Task not found or you do not have permission to update it');
            }
            return this.tasksService.update(id, input);
        });
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Boolean)
    async deleteTask(
        @Args('id', { type: () => ID }) id: number,
        @CurrentUser() user: User
    ): Promise<boolean> {
        // First check if the task belongs to the user
        const task = await this.tasksService.findOne(id);
        if (!task || task.userId !== user.id) {
            throw new Error('Task not found or you do not have permission to delete it');
        }
        await this.tasksService.remove(id);
        return true;
    }
}
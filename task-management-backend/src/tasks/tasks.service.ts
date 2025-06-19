import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Field, ID } from 'type-graphql';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) { }

    findAll(): Promise<Task[]> {
        return this.tasksRepository.find();
    }

    findByUser(userId: number): Promise<Task[]> {
        return this.tasksRepository.find({
            where: { userId }
        });
    }
    findOne(id: number): Promise<Task | null> {
        return this.tasksRepository.findOne({ where: { id } });
    }

    async create(taskData: Partial<Task>): Promise<Task> {
        const task = this.tasksRepository.create(taskData);
        return this.tasksRepository.save(task);
    }
    async update(id: number, taskData: Partial<Task>): Promise<Task | null> {
        await this.tasksRepository.update(id, taskData);
        return this.tasksRepository.findOne({ where: { id } });
    }

    async remove(id: number): Promise<void> {
        await this.tasksRepository.delete(id);
    }
}

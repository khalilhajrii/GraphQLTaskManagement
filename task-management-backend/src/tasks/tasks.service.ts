import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) { }

    findAll(): Promise<Task[]> {
        return this.tasksRepository.find({
            relations: ['user']
        });
    }

    findByUser(userId: number): Promise<Task[]> {
        return this.tasksRepository.find({
            where: { userId },
            relations: ['user']
        });
    }
    findOne(id: number): Promise<Task | null> {
        return this.tasksRepository.findOne({
            where: { id },
            relations: ['user']
        });
    }

    async create(taskData: Partial<Task>): Promise<Task | null> {
        const task = this.tasksRepository.create(taskData);
        await this.tasksRepository.save(task);
        
        // Reload the task with the user relationship populated
        return this.tasksRepository.findOne({
            where: { id: task.id },
            relations: ['user']
        });
    }
    async update(id: number, taskData: Partial<Task>): Promise<Task | null> {
        await this.tasksRepository.update(id, taskData);
        return this.tasksRepository.findOne({
            where: { id },
            relations: ['user']
        });
    }

    async remove(id: number): Promise<void> {
        await this.tasksRepository.delete(id);
    }
}

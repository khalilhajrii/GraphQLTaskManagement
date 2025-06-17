import { Module } from '@nestjs/common';
import { Task } from './task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TasksService, TasksResolver],
  exports: [TasksService],
})
export class TasksModule {}

import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: false
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error = '';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = '';
    
    this.taskService.getMyTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tasks: ' + err.message;
        this.loading = false;
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: (success) => {
          if (success) {
            // Task was deleted successfully, refresh the list
            this.loadTasks();
          }
        },
        error: (err) => {
          this.error = 'Failed to delete task: ' + err.message;
        }
      });
    }
  }

  toggleTaskCompletion(task: Task): void {
    this.taskService.updateTask(task.id, undefined, undefined, !task.completed).subscribe({
      next: (updatedTask) => {
        // Find the task in the array and update it
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
      },
      error: (err) => {
        this.error = 'Failed to update task: ' + err.message;
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { TaskService } from '../tasks/services/task.service';
import { Task } from '../tasks/models/task.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  currentUser: any = null;
  tasks: Task[] = [];
  pendingTasksCount: number = 0;
  completedTasksCount: number = 0;
  highPriorityTasksCount: number = 0;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    // Get the current user from the auth service
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
        this.loadTaskStatistics();
      }
    });

    // If we don't have the current user yet, try to fetch it
    if (!this.currentUser) {
      this.authService.fetchCurrentUser().subscribe(user => {
        if (user) {
          this.loadTaskStatistics();
        }
      });
    }
  }

  loadTaskStatistics(): void {
    this.loading = true;
    this.taskService.getMyTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.calculateTaskStatistics();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load tasks:', err);
        this.loading = false;
      }
    });
  }

  calculateTaskStatistics(): void {
    // Calculate pending tasks (not completed)
    this.pendingTasksCount = this.tasks.filter(task => !task.completed).length;
    
    // Calculate completed tasks
    this.completedTasksCount = this.tasks.filter(task => task.completed).length;
    
    // For high priority tasks, we don't have a priority field in the model
    // This is a placeholder - in a real app, you would have a priority field
    // For now, let's assume the first 3 pending tasks are high priority
    this.highPriorityTasksCount = Math.min(3, this.pendingTasksCount);
  }
}
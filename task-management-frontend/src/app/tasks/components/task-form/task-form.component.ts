import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: false
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId?: number;
  loading = false;
  submitting = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Check if we're in edit mode by looking for an ID in the route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.taskId = +id;
        this.loadTask(this.taskId);
      }
    });
  }

  initForm(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      completed: [false]
    });
  }

  loadTask(id: number): void {
    this.loading = true;
    this.taskService.getTask(id).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description || '',
          completed: task.completed
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load task: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitting = true;
    this.error = '';
    this.success = '';

    // Mark all fields as touched to trigger validation
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });

    if (this.taskForm.invalid) {
      this.submitting = false;
      return;
    }

    const { title, description, completed } = this.taskForm.value;

    if (this.isEditMode && this.taskId) {
      // Update existing task
      this.taskService.updateTask(this.taskId, title, description, completed).subscribe({
        next: () => {
          this.success = 'Task updated successfully';
          this.submitting = false;
          
          // Navigate back to task list after a short delay
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          }, 1500);
        },
        error: (err) => {
          this.error = 'Failed to update task: ' + err.message;
          this.submitting = false;
        }
      });
    } else {
      // Create new task
      this.taskService.createTask(title, description, completed).subscribe({
        next: () => {
          this.success = 'Task created successfully';
          this.submitting = false;
          
          // Navigate back to task list after a short delay
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          }, 1500);
        },
        error: (err) => {
          this.error = 'Failed to create task: ' + err.message;
          this.submitting = false;
        }
      });
    }
  }

  // Getter for easy access to form fields
  get f() { return this.taskForm.controls; }

  // Cancel and go back to task list
  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
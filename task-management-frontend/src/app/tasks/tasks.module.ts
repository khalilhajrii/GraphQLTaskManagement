import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Define routes for the tasks feature module
const routes: Routes = [
  // We'll add task components and routes later
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  // Placeholder for task list component
  // { path: 'list', component: TaskListComponent },
  // Placeholder for task detail component
  // { path: ':id', component: TaskDetailComponent },
];

@NgModule({
  declarations: [
    // Task components will be declared here
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class TasksModule { }
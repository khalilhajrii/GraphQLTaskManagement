import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component'; // Add this import

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // Add this line
  { 
    path: 'tasks', 
    loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule), 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '' } // Keep this as the last route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
passwordStrength: string = 'none'
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });

    // If already logged in, redirect to home page
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.registerForm.get('password')?.valueChanges.subscribe(val => {
      if (!val) {
        this.passwordStrength = 'none';
        return;
      }
      
      const hasLetters = /[a-zA-Z]/.test(val);
      const hasNumbers = /\d/.test(val);
      const hasSpecial = /[^a-zA-Z0-9]/.test(val);
      
      if (val.length < 6) {
        this.passwordStrength = 'weak';
      } else if (hasLetters && hasNumbers && val.length >= 8) {
        this.passwordStrength = 'strong';
      } else if ((hasLetters && hasNumbers) || (hasLetters && hasSpecial) || (hasNumbers && hasSpecial)) {
        this.passwordStrength = 'medium';
      } else {
        this.passwordStrength = 'weak';
      }
    });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Reset alerts
    this.error = '';
    this.success = '';

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.register(
      this.f['fullName'].value,
      this.f['username'].value,
      this.f['password'].value
    ).subscribe({
      next: () => {
        this.success = 'Registration successful';
        this.loading = false;
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: error => {
        this.error = error.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
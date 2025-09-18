import { Component, OnInit } from '@angular/core';
import { User } from '../../model/User';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user:User = new User();
  message: string | null = null;
  messageClass: string = '';

  constructor(private userService:UserService,private router:Router,private snackBar: MatSnackBar){}

  
 errorMessage: string = ''; 

 newUser() {
  if (
    !this.user.fullName || !this.user.username || !this.user.phone ||
    !this.user.password || !this.user.email ||  !this.user.gender
  ) {
    this.showMessage('Please fill in all fields', 'error');
    return;
  }

  this.userService.registerUser(this.user).subscribe({
    next: () => {
      this.showMessage('Registration successful!', 'success');

      // Wait 3 seconds before navigating
      setTimeout(() => {
        this.router.navigate(['']);
      }, 1000);
    },
    error: (err) => {
      this.showMessage('Registration failed. Try again.', 'error');
      console.error(err);
    }
  });
}

private showMessage(msg: string, type: 'success' | 'error') {
  this.message = msg;
  this.messageClass = type === 'success' ? 'alert-success' : 'alert-error';

  setTimeout(() => {
    this.message = null;
  }, 3000);
}
}






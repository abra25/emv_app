import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../model/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  message: string | null = null;
  messageClass: string = '';

  constructor(private userService: UserService, private router: Router) {}

  login() {
  if (!this.username || !this.password) {
    this.showMessage('Please enter username and password', 'error');
    return;
  }

  this.userService.login(this.username, this.password).subscribe({
    next: (user) => {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.showMessage('Login successful!', 'success');

      setTimeout(() => {
        if (user.email === 'mahirabrahman18@gmail.com' || user.email === 'muzakkir@gmail.com') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/employee']);
        }
      }, 500);
    },
    error: (err) => {
      this.showMessage('Login failed: Invalid username or password', 'error');
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

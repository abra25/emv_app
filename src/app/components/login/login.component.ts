import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../model/User';
import { UserService } from '../../services/user.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { retry } from 'rxjs';

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
  menuOpen = false;
 showPassword = false;
 rememberMe: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  login() {
    // ✅ Validation
    if (!this.username || !this.password) {
      this.showToast('Please enter both email and password', 'warning');
      return;
    }

    // ⏳ Loading spinner modal
    Swal.fire({
      title: 'Signing In...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    this.userService.login(this.username, this.password)
      .pipe(retry(2)) // 🔄 Retry network failure 2 times
      .subscribe({
        next: (user) => {
          Swal.close(); // close loading

          // ✅ Remember Me
          if (this.rememberMe) {
            localStorage.setItem('evms-remember-email', this.username);
          } else {
            localStorage.removeItem('evms-remember-email');
          }

          // ✅ Store user info
          localStorage.setItem('currentUser', JSON.stringify(user));

          // ✅ Toast notification
          this.showToast('Login Successful! Redirecting...', 'success');

          // 🔁 Redirect
          setTimeout(() => {
            if (
              user.email === 'mahirabrahman18@gmail.com' ||
              user.email === 'muzakkir@gmail.com'
            ) {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/employee']);
            }
          }, 1200);
        },

        error: (err) => {
          Swal.close();
          console.error(err);
          this.showToast('Login failed: Invalid email or password', 'error');
        }
      });
  }

  // 🔔 Toast Notification
  private showToast(message: string, icon: SweetAlertIcon) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: 'swal-toast'
      }
    });
  }

  toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

togglePassword() {
  this.showPassword = !this.showPassword;
}

}

import { Component, OnInit } from '@angular/core';
import { User } from '../../model/User';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { retry } from 'rxjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';

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
  showPassword = false;
  rememberMe: boolean = false; 


  constructor(private userService:UserService,private router:Router,private snackBar: MatSnackBar){}

  
 errorMessage: string = ''; 

 // 🔐 REGISTER USER
  newUser() {

    // ✅ Basic Validation
    if (
      !this.user.fullName || !this.user.username || !this.user.phone ||
      !this.user.password || !this.user.email || !this.user.gender
    ) {
      this.showToast('Please fill in all fields', 'warning');
      return;
    }

    // ⏳ Loading spinner
    Swal.fire({
      title: 'Registering...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading()
    });

    this.userService.registerUser(this.user)
      .pipe(retry(2)) // 🔄 Retry on network failure
      .subscribe({
        next: () => {
          Swal.close(); // close spinner
          this.showToast('Registration successful! Redirecting...', 'success');

          setTimeout(() => {
            this.router.navigate(['/']); // redirect to login
          }, 1200);
        },

        error: (err) => {
          Swal.close();
          console.error(err);
          this.showToast('Registration failed. Please try again.', 'error');
        }
      });
  }

// 🔔 Toast Notifications
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

togglePassword() {
  this.showPassword = !this.showPassword;
}
}






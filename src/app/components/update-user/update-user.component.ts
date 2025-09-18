import { Component } from '@angular/core';
import { User } from '../../model/User';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-update-user',
  standalone: false,
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent {
  user: User = new User();
  id!: number;
  message: string | null = null;
  messageClass: string = '';

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    if (!this.id || isNaN(this.id)) {
      console.error('Invalid ID from route');
      return;
    }

    this.userService.getUserById(this.id).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Failed to load user', err);
        this.showMessage('Failed to load user.', 'error');
      }
    });
  }

  updateUser(form: NgForm): void {
    if (!form.valid) {
      this.showMessage('Please fill all required fields before updating.', 'error');
      return;
    }
  
    this.userService.updateUser(this.id, this.user).subscribe({
      next: (data) => {
        this.showMessage(`User "${this.user.username}" updated successfully!`, 'success');
        setTimeout(() => {
          this.router.navigate(['/admin/employees']);
        }, 1000);
      },
      error: (err) => {
        this.showMessage('Error updating user. Please try again.', 'error');
        console.error('Error updating user', err);
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

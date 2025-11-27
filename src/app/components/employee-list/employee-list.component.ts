import { Component, OnInit } from '@angular/core';
import { User } from '../../model/User';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  pagedUsers: User[] = [];

  searchTerm: string = '';
  genderFilter: string = '';

  currentPage: number = 1;
  pageSize: number = 5; // number of users per page
  totalPages: number = 1;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
      this.filterUsers();
    });
  }

  filterUsers() {
    let temp = this.users.filter(user =>
      user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.genderFilter) {
      temp = temp.filter(user => user.gender === this.genderFilter);
    }

    this.filteredUsers = temp;
    this.currentPage = 1;
    this.updatePagedUsers();
  }

  updatePagedUsers() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedUsers = this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedUsers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedUsers();
    }
  }

  updateUser(id: number) {
    this.router.navigate(['/update-user', id]);
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.filterUsers();
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Failed to delete user.');
      }
    });
  }
}
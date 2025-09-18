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
export class EmployeeListComponent implements OnInit{
user!:User[]

  constructor(private userService:UserService,private router: Router){}
  ngOnInit(): void {
    this.getAllUser()
  }
  public getAllUser(){
    this.userService.getAllUsers().subscribe(data=>{
       this.user= data;
    })
  }

  updateUser(id: number) {
    this.router.navigate(['/update-user', id]);
  }
  
  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.user = this.user.filter(u => u.id !== id);
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Failed to delete user.');
      }
    });
  }
  
}

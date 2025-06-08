import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Appointment } from '../services/appointment.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-dashboard">
      <h2>Appointment Management Dashboard</h2>
      
      <div class="controls">
        <div class="search-box">
          <input type="text" placeholder="Search appointments..." [(ngModel)]="searchTerm" (input)="filterAppointments()">
        </div>
        <div class="filter-box">
          <select [(ngModel)]="statusFilter" (change)="filterAppointments()">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading">
        Loading appointments...
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div class="table-container" *ngIf="!isLoading && !error">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Address</th>
              <th>AppointmentDate</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let appointment of filteredAppointments">
              <td>{{appointment.name}}</td>
              <td>{{appointment.email}}</td>
              <td>{{appointment.contact}}</td>
              <td>{{appointment.address}}</td>
              <td>{{appointment.date | date:'dd/MM/yyyy'}}</td>
              <td>{{appointment.time | date:'h:mm a':'UTC' }}</td>
              <td>
                <span class="status-badge" [ngClass]="appointment.status">
                  {{appointment.status}}
                </span>
              </td>
              <td class="actions">
                <button class="btn-approve" 
                        (click)="updateStatus(appointment, 'approved')"
                        [disabled]="appointment.status === 'approved'">
                  Approve
                </button>
                <button class="btn-reject" 
                        (click)="updateStatus(appointment, 'rejected')"
                        [disabled]="appointment.status === 'rejected'">
                  Reject
                </button>
                <button class="btn-delete" 
                        (click)="deleteAppointment(appointment)"
                        [disabled]="isDeleting === appointment.id">
                  {{ isDeleting === appointment.id ? 'Deleting...' : 'Delete' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h2 {
      color: #333;
      margin-bottom: 2rem;
    }

    .controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .search-box input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 300px;
    }

    .filter-box select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #333;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-badge.pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-badge.approved {
      background-color: #d4edda;
      color: #155724;
    }

    .status-badge.rejected {
      background-color: #f8d7da;
      color: #721c24;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .actions button {
      padding: 0.25rem 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }

    .actions button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-approve {
      background-color: #28a745;
      color: white;
    }

    .btn-reject {
      background-color: #dc3545;
      color: white;
    }

    .btn-delete {
      background-color: #6c757d;
      color: white;
    }

    .btn-approve:hover:not(:disabled) {
      background-color: #218838;
    }

    .btn-reject:hover:not(:disabled) {
      background-color: #c82333;
    }

    .btn-delete:hover:not(:disabled) {
      background-color: #5a6268;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  `]
})
export class AdminComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  isLoading: boolean = true;
  error: string | null = null;
  isDeleting: number | null = null;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.error = null;

    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.filterAppointments();
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.error = error.message || 'Error loading appointments. Please try again later.';
        this.isLoading = false;
        console.error('Error loading appointments:', error);
      }
    });
  }

  updateStatus(appointment: Appointment, newStatus: 'approved' | 'rejected'): void {
    this.appointmentService.updateAppointment(appointment.id, { status: newStatus }).subscribe({
      next: (updatedAppointment) => {
        const index = this.appointments.findIndex(a => a.id === appointment.id);
        if (index !== -1) {
          this.appointments[index] = updatedAppointment;
          this.filterAppointments();
        }
      },
      error: (error) => {
        console.error('Error updating appointment status:', error);
        alert('Error updating appointment status. Please try again.');
      }
    });
  }

  deleteAppointment(appointment: Appointment): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.isDeleting = appointment.id;
      
      this.appointmentService.deleteAppointment(appointment.id).subscribe({
        next: () => {
          this.appointments = this.appointments.filter(a => a.id !== appointment.id);
          this.filterAppointments();
          this.isDeleting = null;
        },
        error: (error) => {
          console.error('Error deleting appointment:', error);
          alert('Error deleting appointment. Please try again.');
          this.isDeleting = null;
        }
      });
    }
  }

  filterAppointments(): void {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesSearch = 
        appointment.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appointment.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appointment.contact.includes(this.searchTerm) ||
        appointment.address.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = 
        this.statusFilter === 'all' || 
        appointment.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }
} 
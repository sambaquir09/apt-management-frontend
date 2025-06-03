import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="appointment-form">
      <h2>Appointment Manager</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" [(ngModel)]="formData.name" placeholder="Enter your full name" required>
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" [(ngModel)]="formData.email" placeholder="Enter your email address" required>
        </div>

        <div class="form-group">
          <label for="contact">Contact Number:</label>
          <input type="tel" id="contact" name="contact" [(ngModel)]="formData.contact" placeholder="Enter your contact number" required>
        </div>

        <div class="form-group">
          <label for="address">Address:</label>
          <textarea id="address" name="address" [(ngModel)]="formData.address" placeholder="Enter your address" required></textarea>
        </div>

        <button type="submit" [disabled]="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>

        <div *ngIf="submitMessage" [class]="'message ' + (isError ? 'error' : 'success')">
          {{ submitMessage }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    .appointment-form {
      max-width: 500px;
      margin: 2rem auto;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    textarea {
      min-height: 100px;
      resize: vertical;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .message {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 4px;
      text-align: center;
    }

    .message.success {
      background-color: #d4edda;
      color: #155724;
    }

    .message.error {
      background-color: #f8d7da;
      color: #721c24;
    }
  `]
})
export class AppointmentFormComponent {
  formData = {
    name: '',
    email: '',
    contact: '',
    address: ''
  };

  isSubmitting = false;
  submitMessage = '';
  isError = false;

  constructor(private appointmentService: AppointmentService) {}

  onSubmit() {
    this.isSubmitting = true;
    this.submitMessage = '';
    this.isError = false;

    const appointmentData = {
      ...this.formData,
      status: 'pending' as const
    };

    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: (response) => {
        this.submitMessage = 'Appointment submitted successfully!';
        this.isError = false;
        this.resetForm();
      },
      error: (error) => {
        this.submitMessage = 'Error submitting appointment. Please try again.';
        this.isError = true;
        console.error('Error submitting appointment:', error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  private resetForm() {
    this.formData = {
      name: '',
      email: '',
      contact: '',
      address: ''
    };
  }
} 
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-teacher-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, MatExpansionModule, MatCheckboxModule],
  templateUrl: './teacher-schedule.component.html',
  styleUrls: ['./teacher-schedule.component.css']
})
export class TeacherScheduleComponent {
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  data: any[] = [];
  teacherSchedule: any[] = [];
  showList: boolean[] = [];
  classes: string[] = []; // Array to store selected class IDs
  postedSchedules: any[] = []; // Array to store fetched schedules

  Details = {
    start_time: '',
    end_time: '',
    classes: [] as string[], // Array to store class IDs
    subjects: [] as string[]
  };

  constructor(private apiService: ApiService, private router: Router) {
    this.getData();
    this. getTeacherscheduleData()
  }

  getData() {
    this.apiService.get('subject/classlistForTeacher', {
      params: {
        page: this.p,
        limit: this.limit
      }
    }).subscribe((data: any) => {
      this.data = data.data;
      this.total = data.meta.total;
      this.p = data.meta.current_page;
      this.limit = data.meta.per_page;
    });
  }

  getTeacherscheduleData() {
    this.apiService.get('teacherSchedule', {
      params: {
        page: this.p,
        limit: this.limit
      }
    }).subscribe((data: any) => {
      this.teacherSchedule = data.data;
      this.total = data.meta.total;
      this.p = data.meta.current_page;
      this.limit = data.meta.per_page;
    });
  }

  toggleList(index: number) {
    const classId = this.data[index].classDetails._id;
    const classIndex = this.classes.indexOf(classId);

    if (classIndex === -1) {
      this.classes.push(classId); // Add class ID if not already in list
    } else {
      this.classes.splice(classIndex, 1); // Remove if already selected
    }

    this.showList[index] = !this.showList[index]; // Toggle display of subjects list
  }

  toggleSelection(subject: any) {
    const index = this.Details.subjects.indexOf(subject._id);

    if (index === -1) {
      this.Details.subjects.push(subject._id);
    } else {
      this.Details.subjects.splice(index, 1);
    }
  }

  saveData() {
    if (!this.Details.start_time || !this.Details.end_time) {
      alert('Please fill in all required fields.');
      return;
    }

    this.Details.classes = this.classes; // Include selected class IDs

    this.apiService.post('teacherSchedule', this.Details).subscribe({
      next: (res: any) => {
        console.log('Details saved successfully');
        this.router.navigate(['teacherSchedule']);
      },
      error: (err: any) => {
        console.error('Error saving Details:', err);
      }
    });
  }
  deleteItem(index: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.apiService.delete(`teacherSchedule/${this.teacherSchedule[index]._id}`).subscribe({
        next: () => {
          this.getData();
        },
        error: (err: any) => {
          console.error('Error deleting Schedule:', err);
        }
      });
    }
  }
}

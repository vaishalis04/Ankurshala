// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { ApiService } from '../../services/api.service';

// @Component({
//   selector: 'app-explore-classes',
//   standalone: true,
//   imports: [
//     RouterModule,
//     CommonModule,
//   ],
//   templateUrl: './explore-classes.component.html',
//   styleUrl: './explore-classes.component.css'
// })
// export class ExploreClassesComponent {
//   p: number = 1;
//   limit: number = 10;
//   total: number = 0;
//   data: any[] = [];
//   subject: any[] = [];
//   selectedClass: any = null;
//   constructor(
//     private apiService: ApiService ) {
//   }

//   ngOnInit() {
//     this.getClass();
//     this.getSubject();
//   }

//   getClass() {
//     this.apiService.get('class', {
//       params: {
//         page: this.p,
//         limit: this.limit
//       }
//     }).subscribe((data: any) => {
//       this.data = data.data;
//       this.total = data.meta.total;
//       this.p = data.meta.current_page;
//       this.limit = data.meta.per_page;
//       if (this.data.length > 0) {
//         this.selectedClass = this.data[0];
//       }
//     });
    
//   }
  
//   selectClass(item: any) {
//     this.selectedClass = item;
//   }
//   getSubject() {
//     this.apiService.get('subject', {
//       params: { page: 1, limit: 1000 }
//     }).subscribe({
//       next: (res: any) => {
//         this.subject = res.data;
//         console.log('Subjects fetched:', res.data);
//       },
//       error: (err: any) => {
//         console.error('Error fetching subjects:', err);
//       },
//     });
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-explore-classes',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
  ],
  templateUrl: './explore-classes.component.html',
  styleUrls: ['./explore-classes.component.css']
})
export class ExploreClassesComponent {
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  data: any[] = [];
  subject: any[] = [];
  filteredSubjects: any[] = [];
  selectedClass: any = null;

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.getClass();
  }

  getClass() {
    this.apiService.get('class', {
      params: {
        page: this.p,
        limit: this.limit
      }
    }).subscribe((data: any) => {
      this.data = data.data;
      this.total = data.meta.total;
      this.p = data.meta.current_page;
      this.limit = data.meta.per_page;

      // Set the first item as initially selected if data is not empty
      if (this.data.length > 0) {
        this.selectedClass = this.data[0];
        this.getSubject(this.selectedClass._id); // Fetch subjects based on initially selected class
      }
    });
  }

  // selectClass(item: any) {
  //   this.selectedClass = item;
  //   this.getSubject(item.id); // Fetch subjects based on the selected class
  // }
  selectClass(item: any) {
    this.selectedClass = item;
    this.getSubject(item._id); // Fetch subjects based on the selected class
  }
  // getSubject(classId: string) {
  //   this.apiService.get('subject', {
  //     params: { 
  //       page: 1, 
  //       limit: 1000, 
  //       class: classId // Filter by class ID
  //     }
  //   }).subscribe({
  //     next: (res: any) => {
  //       this.subject = res.data;
  //       this.filteredSubjects = this.subject.filter(subj => subj.class === classId); // Filter subjects based on selected class
  //       console.log('Filtered Subjects:', this.filteredSubjects);
  //     },
  //     error: (err: any) => {
  //       console.error('Error fetching subjects:', err);
  //     },
  //   });
  // }
  getSubject(classId: string) {
    this.apiService.get('subject', {
      params: { 
        page: 1, 
        limit: 1000, 
        class: classId // Filter by class ID
      }
    }).subscribe({
      next: (res: any) => {
        this.subject = res.data;
        this.filteredSubjects = this.subject.filter(subj => subj.class === classId); // Filter subjects based on selected class
        console.log('Fetched Subjects:', this.subject); // Log the full response
        console.log('Filtered Subjects:', this.filteredSubjects); // Log the filtered response
      },
      error: (err: any) => {
        console.error('Error fetching subjects:', err);
      },
    });
  }
  
}

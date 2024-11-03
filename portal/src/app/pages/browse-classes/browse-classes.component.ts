import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-browse-classes',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './browse-classes.component.html',
  styleUrl: './browse-classes.component.css'
})
export class BrowseClassesComponent {
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  data: any[] = [];
  topic: any[] = [];
  subject: any[] = [];
  subjectList: any[] = [];
  chapterList: any[] = [];
  topicList: any[] = [];
  searchForm = {
    classes: '',
    subject: '',
    start_time: '',
    end_time: ''
  };
  constructor(
    private apiService: ApiService,private http: HttpClient  ) {
    
  }

  ngOnInit() {
    this.getClass();
    this.getSubject();
    this.getChapter();
    this.getTopic();
   
  }
  search() {
    // Construct query parameters from searchForm
    const params = {
      classes: this.searchForm.classes,
      subject: this.searchForm.subject,
      start_time: this.searchForm.start_time,
      end_time: this.searchForm.end_time
    };

    this.apiService.get('teacherSchedule/search', { params }).subscribe(
      (response) => {
        console.log('Search results:', response);
        // Handle the response data here, such as displaying it on the page
      },
      (error) => {
        console.error('Search failed:', error);
        // Handle any errors here
      }
    );
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
    });
  }
  onClassChange(event: any) {
    const selectedClassId = event.target.value;
    if (selectedClassId) {
      this.getSubjectsByClass(selectedClassId);
    } else {
      this.subjectList = [];
    }
  }

  getSubjectsByClass(classId: string) {
    this.apiService.get(`subject/classId/${classId}`).subscribe({
      next: (res: any) => {
        this.subjectList = res.data;
      },
      error: (err: any) => {
        console.error('Error fetching subjects:', err);
      },
    });
  }
  getSubject() {
    this.apiService.get('subject', {
      params: { page: 1, limit: 1000 }
    }).subscribe({
      next: (res: any) => {
        this.subject = res.data;
        console.log('Subjects fetched:', res.data);
      },
      error: (err: any) => {
        console.error('Error fetching subjects:', err);
      },
    });
  }
  getChapter() {
    this.apiService.get('chapter', {
      params: { page: 1, limit: 1000 }
    }).subscribe({
      next: (res: any) => {
        this.subject = res.data;
        console.log('Chapters fetched:', res.data);
      },
      error: (err: any) => {
        console.error('Error fetching chapters:', err);
      },
    });
  }
  onSubjectChange(event: any) {
    const selectedSubjectId = event.target.value;
    if (selectedSubjectId) {
      this.getChapterBySubject(selectedSubjectId);
    } else {
      this.chapterList = [];
    }
  }
  onChapterChange(event: any) {
    const selectedChapterId = event.target.value;
    if (selectedChapterId) {
      this.getTopicByChapter(selectedChapterId);
    } else {
      this.topicList = [];
    }
  }
  getChapterBySubject(subjectId: string) {
    this.apiService.get(`chapter/subjectId/${subjectId}`).subscribe({
      next: (res: any) => {
        this.chapterList = res.data;
        console.log('Chapters fetched:', res.data);
      },
      error: (err: any) => {
        console.error('Error fetching chapters:', err);
      },
    });
  }
  getTopicByChapter(chapterId: string) {
    this.apiService.get(`topic/chapterId/${chapterId}`).subscribe({
      next: (res: any) => {
        this.topicList = res.data;
        console.log('Topics fetched:', res.data);
      },
      error: (err: any) => {
        console.error('Error fetching Topics:', err);
      },
    });
  }
  getTopic() {
    this.apiService.get('topic', {
      params: { page: 1, limit: 1000 }
    }).subscribe({
      next: (res: any) => {
        this.topic = res.data;
        console.log('Topics fetched:', res.data);
      },
      error: (err: any) => {
        console.error('Error fetching Topics:', err);
      },
    });
  }
  resetForm() {
    this.searchForm = {
      classes: '',
      subject: '',
      start_time: '',
      end_time: ''
    };
  }
}

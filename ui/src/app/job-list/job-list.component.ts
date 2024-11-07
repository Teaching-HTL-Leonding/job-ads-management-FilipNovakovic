import { Component, signal } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobPageService } from '../../job-page.service';
import {CommonModule, NgForOf} from '@angular/common';

interface Jobs {
  title: string;
  textEN: string;
  id: number;
  translations: { language: string, translatedText: string }[];
}

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, NgForOf],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css'
})

export class JobListComponent {

  jobAds = signal<Jobs[]>([]);

  constructor(private jobService: JobPageService, private router: Router) {
    this.getAllJobs();
  }

  getAllJobs() {
    this.jobService.getAllJobs().then((jobs) => {
      this.jobAds.set(jobs);
    });
    console.log(this.jobAds());
  }

  deleteJobById(id: number) {
    this.jobService.deleteJobById(id).then(() => {
      this.getAllJobs();
    });
  }

  viewJobDetails(id: number) {
    this.router.navigate([`/job-list/${id}`]);
  }

}


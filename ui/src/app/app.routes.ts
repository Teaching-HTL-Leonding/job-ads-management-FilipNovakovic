import { Routes } from '@angular/router';
import { JobListComponent } from './job-list/job-list.component';
import { JobDetailComponent } from './job-detail/job-detail.component';

export const routes: Routes = [
  {path: 'job-list', component: JobListComponent},
  {path: '', redirectTo: '/job-list', pathMatch: 'full'},
  {path: 'job-list/:id', component: JobDetailComponent}
];

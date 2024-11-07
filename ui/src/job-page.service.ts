import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { transition } from '@angular/animations';

interface Jobs {
  title: string;
  textEN: string;
  id: number;
  translations: { language: string, translatedText: string }[];
}

interface newTranslation{
  language: string;
  translatedText: string;
}


@Injectable({
  providedIn: 'root'
})

export class JobPageService {
  upsertTranslation(jobAd: Jobs, language: string, translatedText: string) {
    return firstValueFrom(
      this.httpClient.put(`http://localhost:3000/ads/${jobAd.id}/translations/${language}`, { translatedText: translatedText })
    );
  }

  deleteTranslation(jobAd: Jobs, language: string) {
    return firstValueFrom(
      this.httpClient.delete(`http://localhost:3000/ads/${jobAd.id}/translations/${language}`)
    );
  }

  updateJob(jobAd: Jobs) {
    return firstValueFrom(
      this.httpClient.patch(`http://localhost:3000/ads/${jobAd.id}`, {title: jobAd.title, textEN: jobAd.textEN})
    );
  }

  private httpClient = inject(HttpClient);


  constructor() { }

  getAllJobs() {
    return firstValueFrom(
      this.httpClient.get<Jobs[]>('http://localhost:3000/ads')
    );
  }

  deleteJobById(id: number) {
    return firstValueFrom(
      this.httpClient.delete(`http://localhost:3000/ads/${id}`)
    );
  }

  getJobById(id: number) {
    return firstValueFrom(
      this.httpClient.get<Jobs>(`http://localhost:3000/ads/${id}`)
    );
  }


}

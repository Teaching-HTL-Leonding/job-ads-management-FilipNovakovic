import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobPageService } from '../../job-page.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css'
})

export class JobDetailComponent {
  id: number = 0;
  jobAd = signal<Jobs | null>(null);
  translationDE = signal<string | null>("");
  isEditing = signal<boolean>(false);
  editableTextEN: string = '';
  editableTitle: string = '';
  AllTranslations = signal<newTranslation[]>([]);
  isEditingTranslation = signal<boolean>(false);
  addTranslationConten: string = '';
  addTranslationTitle: string = '';
  deleteLanguage = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private jobService: JobPageService,
    private router: Router
  ) {
    const idParam = this.route.snapshot?.paramMap.get('id');
    this.id = idParam ? +idParam : 0;
    console.log(this.id);
    this.getJobDetails();
  }

  async getJobDetails() {
    const response: Jobs = await this.jobService.getJobById(this.id);
    this.jobAd.set(response ? response : null);

    const translation = response?.translations.find(t => t.language === 'DE');
    if (translation) {
      for(let translation of response.translations){
      const currentTranslations = this.AllTranslations();
      const newTranslation = {language: translation.language, translatedText: translation.translatedText};
      currentTranslations.push(newTranslation);
      this.AllTranslations.set(currentTranslations);
    }} else {
      this.translationDE.set("keine Übersetzung vorhanden");
    }
    console.log(this.jobAd());
  }

  async editJob() {
    this.isEditing.set(true);
    const jobAd = this.jobAd();
    if (jobAd) {
      this.editableTextEN = jobAd.textEN;
      this.editableTitle = jobAd.title;
    }
  }

  async saveJob() {
    const jobAd = this.jobAd();
    if (jobAd) {
      jobAd.textEN = this.editableTextEN;
      jobAd.title = this.editableTitle;
      await this.jobService.updateJob(jobAd);
      this.isEditing.set(false);
    }
  }

  async addTranslation(){
    this.isEditingTranslation.set(true);
  }

  async saveTranslation(){
    const translation = this.AllTranslations();
    const newTranslation = {language: this.addTranslationTitle, translatedText: this.addTranslationConten};
    translation.push(newTranslation);
    this.AllTranslations.set(translation);
    const jobAd = this.jobAd();
    if (jobAd) {
      await this.jobService.upsertTranslation(jobAd, this.addTranslationTitle, this.addTranslationConten);
    }
    this.isEditingTranslation.set(false);
  }

  async deleteTranslation(){
    const language = this.deleteLanguage();
    if (language) {
      console.log(language);
      const currentTranslations = this.AllTranslations();
      const newTranslations = currentTranslations.filter(t => t.language !== language);
      this.AllTranslations.set(newTranslations);
      const jobAd = this.jobAd();
      if (jobAd) {
        this.jobService.deleteTranslation(jobAd, language).then(r => console.log(r));
      }
      this.deleteLanguage.set('');
    }
  }

  navigateBack() {
    this.router.navigate(['/job-list']);
  }
}

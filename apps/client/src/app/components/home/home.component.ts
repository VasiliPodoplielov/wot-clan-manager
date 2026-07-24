import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationFormComponent } from '../application-form/application-form.component';
import { EventsService } from '../../services/events-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    FormsModule,
    RouterModule,
    ApplicationFormComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  eventsService = inject(EventsService);
  activeEvent$ = this.eventsService.activeEvent$;

  ngOnInit(): void {
    this.eventsService.getActiveEvent();
  }
}

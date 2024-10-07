import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignarAsesoriaComponent } from './asignar-asesoria.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';



@NgModule({
  declarations: [AsignarAsesoriaComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    AppRoutingModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    MatRadioModule,
    MatDatepickerModule
  ]
})
export class AsignarAsesoriaModule { }

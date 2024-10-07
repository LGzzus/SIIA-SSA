import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitarAsesoriaComponent } from './solicitar-asesoria.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [SolicitarAsesoriaComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class SolicitarAsesoriaModule { }

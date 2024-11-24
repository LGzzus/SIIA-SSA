import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncuestasService } from '../../servicios/encuestas.service';
interface Respuesta {
  int_Id_Encuesta: number;
  int_id_Asesoria_Control: number;
  int_Id_Pregunta: number;
  int_Id_Opcion: number | null;
  str_Respuesta_Texto: string | null;
}

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.css'],
})
export class PreguntasComponent implements OnInit {
  idEncuesta: any;
  preguntas: any = [];
  preguntasForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _encuestaServices: EncuestasService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.idEncuesta = params;
    });

    this._encuestaServices.preguntasConRespuestasEncuestas(this.idEncuesta).subscribe((response) => {
      this.preguntas = response;
      this.initForm();
    });
  }

  initForm() {
    // Inicializar el formulario dinámicamente
    const controls: any = {};
    this.preguntas.preguntas.forEach((pregunta: any, index: number) => {
      controls[`pregunta_${index}`] = ['', Validators.required];
    });
    this.preguntasForm = this.fb.group(controls);
  }

  guardarRespuestas() {
    if (this.preguntasForm.valid) {
      const respuestasJSON: Respuesta[] = this.preguntas.preguntas.map((pregunta: any, index: number) => {
        const respuesta = this.preguntasForm.get(`pregunta_${index}`)?.value;

        return {
          int_Id_Encuesta: Math.trunc(this.idEncuesta.idEncuesta),
          int_Id_Asesoria_Control: 1,
          int_Id_Pregunta: pregunta.id,
          int_Id_Opcion: pregunta.tipo === 'opcion_multiple' ? respuesta : null,
          str_Respuesta_Texto: pregunta.tipo === 'opcion_libre' ? respuesta : null,
        };
      });

      console.log('Respuestas JSON:', respuestasJSON);

      /*for (let entry of Array.from(map.entries())) {
    let key = entry[0];
    let value = entry[1];
}*/
      respuestasJSON.forEach((respuesta1: Respuesta) => {
        console.log(respuesta1);
        this._encuestaServices.registrarRespuesta(respuesta1).subscribe((response) =>{
          console.log(response);
          
        })
      })
      // Aquí puedes enviar el `respuestasJSON` al backend.
    } else {
      console.log('Formulario inválido');
    }
  }
}

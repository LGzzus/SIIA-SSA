import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-observaciones-reportes',
  templateUrl: './observaciones-reportes.component.html',
  styleUrls: ['./observaciones-reportes.component.css']
})
export class ObservacionesReportesComponent implements OnInit {

  matricula: String;
  nombre: String;

  datosTicket = this.formBuilder.group({
    tipoTicket : new FormControl(" ",[Validators.required]),
    contenidoTicket: new FormControl(" ",[Validators.required]),
  })

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.matricula = params["matricula"];
        this.nombre = params["strNombreAlumno"]        
      }
    )
  }

  registrarTicket(matricula: any){
    console.log(matricula+" + ");
    const datosTicket = {
      matricula: this.matricula,
      selectTipoTicket: this.datosTicket.value.tipoTicket,
      contenido: this.datosTicket.value.contenidoTicket
    }

    console.log(datosTicket);
    
  }

}

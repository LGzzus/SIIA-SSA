import { Component } from '@angular/core';
import { SolicitudesServicesService } from '../../servicios/solicitudes-services.service';
import { NotificationService } from '../../servicios/core/notification.service';

@Component({
  selector: 'app-firmar-invitacion',
  templateUrl: './firmar-invitacion.component.html',
  styleUrls: ['./firmar-invitacion.component.css']
})
export class FirmarInvitacionComponent {

  response:any;
  constructor(
    private _solicitudService : SolicitudesServicesService,
    private _notificationService : NotificationService,
  ){}

  public aceptarSolicitud(){
    console.log("entro aceptarSolicitud")
    let solicitudVO = {
      idSolicitud : sessionStorage.getItem("idSolicitud")
    }
    this._solicitudService.postAceptarSolicitud(solicitudVO).subscribe((response : Blob) => {
      const blob = new Blob([response], { type: 'application/pdf' });
    
    // Crea una URL temporal para el blob
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'solicitud.pdf'

      link.click()
      console.log(url);
      this.response = response;
      
      this._notificationService.pushSuccess("Acesoria firmada, Descargando oficio")
      
    })
  }

  public rechazarSolicitud(){
    console.log("entro rechazarSolicitud")
  }
}

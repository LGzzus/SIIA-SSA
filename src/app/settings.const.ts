import { HttpHeaders } from '@angular/common/http';

export class AppSettings {

    public static API_ENDPOINT = 'https://siiadsyti.uatx.mx:8743';
    public static URL_MIDDELWARE = 'http://localhost:3000/api/tutorias/'
    
    public static TITLE = 'SIIA 5';
    public static SLOGAN = 'Sistema integral de información administrativa';
    public static COPYRIGHT = 'Copyright © 2022 - Todos los derechos reservados';

    public static TOKEN_USER = "token";
    public static LOGGED_USER = "loggedUser";
    public static OPTIONS_LOGGED_USER = "optionsLoggedUser";

   
    public static CODE_LOST_REQUEST = 0;
    public static CODE_WRONG_REQUEST = 400;
    public static CODE_WITHOUT_AUTHORIZATION = 401;
    public static CODE_OK = 200;

    public static HEADERS = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Access-Control-Allow-Credentials' : 'true',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
          })
    };

    
    public static getTypeMessageByCode(code: number): string {
        let type_message: string;
        
        switch (code) {
            case 301:
                type_message = 'alert-warning';
                break;
            case 200:
                type_message = 'alert-success';
                break;
            case 500:
                type_message = 'alert-danger';
                break;
            default:
                type_message = 'alert-warning';
                break;
        }
        return type_message;

    }


    public static getTypeMessageByCodeSeverity(code: number): string {
        let type_message: string;
        switch (code) {
            case 1:
                type_message = 'alert-success';
                break;
            case 2:
                type_message = 'alert-warning';
                break;
            case 3:
                type_message = 'alert-danger';
                break;
            default:
                type_message = 'alert-warning';
                break;
        }
        return type_message;

    }



}

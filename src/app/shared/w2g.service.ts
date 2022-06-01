import {Injectable, Input} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Category, EventCard, User, City} from "./w2g.model";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {LoginPage} from "../login/login.page";
import {ModalController, Platform} from "@ionic/angular";
import {Router} from "@angular/router";
import {Storage} from "@ionic/storage";

const httpOptionsLogin = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})

export class W2gService {
  @Input()isModal:boolean;
  logoutTimer = new BehaviorSubject(0);
  private readonly HS_API_URL='http://192.168.0.12:3000';
  //private readonly HS_API_URL='http://62.109.24.249:3000';
  private token : string;
  private headers = new HttpHeaders;
  constructor(private router: Router, private http:HttpClient, private platform:Platform, private modalCtrl:ModalController, private storage:Storage) {
    if (this.platform.is('ios')) {
      this.platform.ready().then(() => {
        this.platform.pause.subscribe(() => {
          this.lockApp();
          console.log('It Blocked');
          if (this.isModal) {
            this.onDismissModal();
          }
        });
      });
    }
    storage.create();
  }

  onDismissModal(){
    this.modalCtrl.dismiss();
    console.log('Modal Hiden');
  }

  async lockApp(){
    const modal= await this.modalCtrl.create({
      component:LoginPage,
      backdropDismiss:false,
      componentProps:{
        isModal:true
      }
    });
    modal.present();
  }

  /* Events */
  public getAllEvents():any{
    return this.http.get<EventCard[]>(`${this.HS_API_URL}/events`);
  }
  public getEvents(id:number):any{
    return this.http.get<EventCard[]>(`${this.HS_API_URL}/events/${id}`);
  }
  public getEvent(id:number):any{
    return this.http.get<EventCard>(`${this.HS_API_URL}/event/${id}`);
  }
  public getEventsByOrderASC(id:number):any{
    return this.http.get<EventCard[]>(`${this.HS_API_URL}/events/order_asc/${id}`);
  }
  public getEventsByOrderDESC(id:number):any{
    return this.http.get<EventCard[]>(`${this.HS_API_URL}/events/order_desc/${id}`);
  }
  public getFavoriteEvents(id:number):any{
    return this.http.get<EventCard[]>(`${this.HS_API_URL}/f_events/${id}`);
  }
  public getEventsByCategory(id:number):any{
    return this.http.get<EventCard[]>(`${this.HS_API_URL}/cat_event/${id}`);
  }
  public getEventsByCity(id:number):any{
    return this.http.get<EventCard[]>(`${this.HS_API_URL}/city_event/${id}`);
  }

  /* Categories */
  public getCategories():any{
    return this.http.get<Category[]>(`${this.HS_API_URL}/categories`);
  }

  /* Cities */
  public getCities():any{
    return this.http.get<City[]>(`${this.HS_API_URL}/cities`);
  }

  public login(userEmail:string, userPass:string):Observable<any>{
    let userAuth:User={email:userEmail, password:userPass}
    return this.http.post<any>(`${this.HS_API_URL}/login`, userAuth,httpOptionsLogin).pipe(
      catchError((err) => {
          console.log("Error en el login");
          console.error(err);
          return throwError(err);
        }
      )
    );
  }

  public getUserPorEmail(token:string): Observable<User>{
    var reqHeader = new HttpHeaders ({ Authorization: `Bearer ${token}`});
    return this.http.get<User>(`${this.HS_API_URL}/getuser`, {headers:reqHeader});
  }

  public userPINCode;

  public assignPIN(pinInput:string):string{
    this.userPINCode = pinInput.toString();
    console.log(this.userPINCode);
    return pinInput;
  }
  public getUserByPIN(pinInput:string):string{
    return pinInput;
  }
}

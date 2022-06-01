import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {W2gService} from "../shared/w2g.service";
import {Category, City, EventCard} from "../shared/w2g.model";
import {Globalization} from "@ionic-native/globalization/ngx";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public events = [];
  public categories=[];
  public cities=[];
  public event:EventCard;
  public category:Category;
  public city:City;
  language: string;

  eventDate:string;
  eventCity:string;
  eventCategory:string;
  viewAllCategory:string;
  eventPrice:string;
  priceFrom:string;
  orderMinMax:string;
  orderMaxMin:string;


  constructor(private route: ActivatedRoute, private router: Router, private w2gServ:W2gService, private glob:Globalization, private _translate:TranslateService) {}

  ngOnInit(){
    this.w2gServ.getEvents(4).subscribe(events=>{
      this.events=events;
    });
    this.w2gServ.getCategories().subscribe(categories=>{
      this.categories=categories;
    })
    this.w2gServ.getCities().subscribe(cities=>{
      this.cities=cities;
    })
  }

  /* Translate */
  ionViewDidEnter(): void {
    this.getDeviceLanguage()
  }

  _initialiseTranslation(): void {
    this._translate.get('eventDate').subscribe((res: string) => {
      this.eventDate = res;
    });
    this._translate.get('eventCategory').subscribe((res:string)=>{
      this.eventCategory=res;
    });
    this._translate.get('viewAllCategory').subscribe((res:string)=>{
      this.viewAllCategory=res;
    });
    this._translate.get('eventCity').subscribe((res:string)=>{
      this.eventCity=res;
    });
    this._translate.get('orderMinMax').subscribe((res:string)=>{
      this.orderMinMax=res;
    });
    this._translate.get('orderMaxMin').subscribe((res:string)=>{
      this.orderMaxMin=res;
    });
    this._translate.get('eventPrice').subscribe((res:string)=>{
      this.eventPrice=res;
    });
    this._translate.get('eventCategory').subscribe((res:string)=>{
      this.priceFrom=res;
    });
  }

  public changeLanguage(): void {
    this._translateLanguage();
  }

  _translateLanguage(): void {
    this._translate.use(this.language);
    this._initialiseTranslation();
  }

  _initTranslate(language) {
    // Set the default language for translation strings, and the current language.
    this._translate.setDefaultLang('es');
    if (language) {
      this.language = language;
    }
    else {
      this.language = 'es';
    }
    this._translateLanguage();
  }

  getDeviceLanguage() {
    if (window.Intl && typeof window.Intl === 'object') {
      this._initTranslate(navigator.language)
    }
    else {
      this.glob.getPreferredLanguage()
        .then(res => {
          this._initTranslate(res.value)
        })
        .catch(e => {console.log(e);});
    }
  }
  /* Translate End */

  viewCurrentEvent(id):void{
    this.router.navigate(['/event',id]);
  }


  selected_category:number;
  categoryChanged(){
    console.log(this.selected_category);
    if (this.selected_category!=0) {
      this.w2gServ.getEvents(4).subscribe(events => {
        this.events=events;
        this.events.push(this.route.params.subscribe(params => {
          let id = params['id'];
          this.w2gServ.getEventsByCategory(this.selected_category).subscribe(events => {
            this.events = events;
          })
        }))
      });
    }
    else {
      this.getAllEvents();
    }
  }

  select_price:number;
  priceOrderChanged(){
    if(this.select_price==0){
      this.w2gServ.getEventsByOrderASC(4).subscribe(events => {
        this.events = events;
      });
    }
    else {
      this.w2gServ.getEventsByOrderDESC(4).subscribe(events => {
        this.events = events;
      });
    }
  }

  selected_city:number;
  cityChanged(){
    console.log(this.selected_city);
    if (this.selected_city!=0) {
      this.w2gServ.getEventsByCity(this.selected_city).subscribe(events => {
        this.events = events;
      })
    }
    else {
      this.getAllEvents();
    }
  }

  getAllEvents() {
    this.events.push(this.route.params.subscribe(params => {
      this.w2gServ.getEvents(4).subscribe(events => {
        this.events = events;
      })
    }))
  }
}

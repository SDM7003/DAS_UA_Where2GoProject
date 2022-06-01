import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {W2gService} from "../shared/w2g.service";
import {EventCard} from "../shared/w2g.model";
import {Globalization} from "@ionic-native/globalization/ngx";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  public event;
  public events=[];
  language: string;
  priceFrom:string;

  constructor(private route: ActivatedRoute,private router:Router,
              private w2gService:W2gService, private glob:Globalization, private _translate:TranslateService) {
    this.events.push(this.route.params.subscribe(params=>{
      let id=params['id'];
      this.w2gService.getEvent(id).subscribe(event=>{
        this.event=event;
      })
    }))
  }

  /* Translate */
  ionViewDidEnter(): void {
    this.getDeviceLanguage()
  }

  _initialiseTranslation(): void {
    this._translate.get('priceFrom').subscribe((res:string)=>{
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

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.event = this.w2gService.getEvent(params.id);
    });
  }

  backBtn(){
    window.history.back();
  }
}

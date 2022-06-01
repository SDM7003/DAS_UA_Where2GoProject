import { Component, OnInit } from '@angular/core';
import {EventCard} from "../shared/w2g.model";
import {ActivatedRoute, Router} from "@angular/router";
import {W2gService} from "../shared/w2g.service";
import {Globalization} from "@ionic-native/globalization/ngx";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.page.html',
  styleUrls: ['./search-result.page.scss'],
})
export class SearchResultPage implements OnInit {

  public filterEvent = '';
  public events = [];
  public event:EventCard;

  language: string;
  searchResultBy:string;
  priceFrom:string;

  constructor(private route: ActivatedRoute, private router: Router, private w2gServ:W2gService, private glob:Globalization, private _translate:TranslateService) {
    this.route.params.subscribe( params => {
      this.filterEvent = params.filterEvent;
    });
  }

  ngOnInit() {
    this.w2gServ.getAllEvents().subscribe(events=>{
      this.events=events;
    });
  }

  /* Translate */
  ionViewDidEnter(): void {
    this.getDeviceLanguage()
  }

  _initialiseTranslation(): void {
    this._translate.get('searchResultBy').subscribe((res: string) => {
      this.searchResultBy = res;
    });
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

  viewCurrentEvent(id):void{
    this.router.navigate(['/event',id]);
  }
  backBtn(){
    window.history.back();
  }
}

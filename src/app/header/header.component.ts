import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {W2gService} from "../shared/w2g.service";
import {User} from "../shared/w2g.model";
import {Globalization} from "@ionic-native/globalization/ngx";
import {TranslateService} from "@ngx-translate/core";
import {AccountPage} from "../account/account.page";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  user:User;
  enterBtn:string;
  language: string;

  constructor(private router:Router, private w2gServ:W2gService, private glob:Globalization, private _translate:TranslateService, private usAccount:AccountPage) {}

  public filterEvent = '';

  ngOnInit() {
    this.w2gServ.getUserPorEmail(localStorage.getItem('token')).subscribe(c=>{
      this.user=c;
      sessionStorage.setItem('user', JSON.stringify(this.user));
    });
  }

  /* Translate */
  ionViewDidEnter(): void {
    this.getDeviceLanguage()
  }

  _initialiseTranslation(): void {
    this._translate.get('EnterBtn').subscribe((res: string) => {
      this.enterBtn = res;
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

  public token;

  getTokenByUser(){
    console.log('Token', this.usAccount.getToken());
    return this.usAccount.getToken();
  }

  viewLoginPage():void{
    this.router.navigate(['/login']);
  }
  goToHome():void{
    this.router.navigate(['']);
  }
  viewAccount(){
    this.router.navigate(['/account']);
  }
}

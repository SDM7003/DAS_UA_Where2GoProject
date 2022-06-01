import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {W2gService} from "../shared/w2g.service";
import {Category, User} from "../shared/w2g.model";
import {Globalization} from "@ionic-native/globalization/ngx";
import {TranslateService} from "@ngx-translate/core";
import {ModalController} from "@ionic/angular";
import {LoginPage} from "../login/login.page";
import {Platform} from "@ionic/angular";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  public categories=[];
  public category:Category;
  user:User;
  language:string;
  public events=[];

  userPhone:string;
  bDate:string;
  accountType:string;
  userInterests:string;
  favEvents:string;
  PINBtnToggle:string;
  createPINSubmit:string;

  constructor(private route: ActivatedRoute, private router: Router, private w2gServ:W2gService,
              private glob:Globalization, private _translate:TranslateService, private modalCtrl:ModalController,
              private platform:Platform, private fb:FormBuilder) {
    w2gServ.getCategories().subscribe(categories=>{
      this.categories=categories;
    });
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

  /* Translate */
  ionViewDidEnter(): void {
    this.getDeviceLanguage()
  }

  _initialiseTranslation(): void {
    this._translate.get('userPhone').subscribe((res:string)=>{
      this.userPhone=res;
    });
    this._translate.get('bDate').subscribe((res:string)=>{
      this.bDate=res;
    });
    this._translate.get('accountType').subscribe((res:string)=>{
      this.accountType=res;
    });
    this._translate.get('userInterests').subscribe((res:string)=>{
      this.userInterests=res;
    });
    this._translate.get('favEvents').subscribe((res:string)=>{
      this.favEvents=res;
    });
    this._translate.get('PINBtnToggle').subscribe((res:string)=>{
      this.PINBtnToggle=res;
    });
    this._translate.get('createPINSubmit').subscribe((res:string)=>{
      this.createPINSubmit=res;
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

  getToken(){
    this.token=localStorage.getItem('token');
    //console.log(this.token);
    return this.token;
  }

  token:string;
  ngOnInit() {
    this.w2gServ.getUserPorEmail(localStorage.getItem('token')).subscribe(c=>{
      this.user=c;
      this.events.push(this.route.params.subscribe(params=>{
        let id=params['id'];
        this.w2gServ.getFavoriteEvents(4).subscribe(events=>{
          this.events=events;
          //console.log(events);
        })
      }));
      setTimeout(()=>{
        localStorage.clear();
        this.router.navigate(['/login']);
        console.log(localStorage.getItem('token'));
      }, 1000000);
    });
    if(this.getToken()==null){
      this.router.navigate(['/login']);
    }
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  viewCurrentEvent(id):void{
    this.router.navigate(['/event',id]);
  }

  createPIN=this.fb.group({
    pinInput:['',Validators.required],
  })
  get p () {return this.createPIN.controls;}

  createPINF(){
    if (localStorage.getItem('token')!=null){
      this.w2gServ.assignPIN(this.p.pinInput.value);
      console.log(this.p.pinInput.value);
      this.p.pinInput.setValue('');
      this.togglePINAdd=!this.togglePINAdd;
    }
  }

  togglePINAdd: boolean=false;
  addPIN() {
    this.togglePINAdd=!this.togglePINAdd;
  }
}

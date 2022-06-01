import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {W2gService} from "../shared/w2g.service";
import {User} from "../shared/w2g.model";
import {Globalization} from "@ionic-native/globalization/ngx";
import {TranslateService} from "@ngx-translate/core";
import {FingerprintAIO, FingerprintOptions} from "@ionic-native/fingerprint-aio/ngx";
import {ModalController, Platform} from "@ionic/angular";
import {AccountPage} from "../account/account.page";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @Input()isModal:boolean;
  faioOptions:FingerprintOptions;
  constructor(private router:Router, private fb:FormBuilder, private w2gService:W2gService,
              private glob:Globalization, private _translate:TranslateService, private faio:FingerprintAIO,
              private modalCtrl:ModalController, private acc:AccountPage, public platform:Platform, private usAccount:AccountPage) {
    this.faioOptions={
      disableBackup:true
    }
  }

  user:User;
  language:string;
  entryPageTITLE:string;
  PasswordInput:string;
  enterBtn:string

  /* Translate */
  ionViewDidEnter(): void {
    this.getDeviceLanguage()
  }

  _initialiseTranslation(): void {
    this._translate.get('entryPageTITLE').subscribe((res:string)=>{
      this.entryPageTITLE=res;
    });
    this._translate.get('PasswordInput').subscribe((res:string)=>{
      this.PasswordInput=res;
    });
    this._translate.get('enterBtn').subscribe((res:string)=>{
      this.enterBtn=res;
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
    console.log('I am modal: ', this.isModal);
    this.userPINCode=this.w2gService.userPINCode;
    console.log('Current PIN',this.userPINCode);
    if ((this.isModal) && (this.userPINCode)){
      this.toggleLoginCompl=false;
      this.togglePIN=true;
    }
  }

  loginForm=this.fb.group({
    userEmail:['',Validators.required],
    userPass:['',Validators.required],
  })
  get l () {return this.loginForm.controls;}

  pinForm=this.fb.group({
    pinInput:['',Validators.required]
  })
  get p(){return this.pinForm.controls}

  async showFingerprintDialog(){
    try{
      await this.platform.ready();
      const avalible = await this.faio.isAvailable();
      console.log(avalible);
      if (avalible==="OK"){
        this.faio.show(this.faioOptions)
      }
    }
    catch (e){
      console.error(e);
    }
  }

  public token;
  toggleLoginCompl: boolean=true;
  togglePIN:boolean=false;

  getTokenByUser(){
    return this.usAccount.getToken();
  }

  changeAuthMethod(){
    this.toggleLoginCompl=!this.toggleLoginCompl;
    this.togglePIN=!this.togglePIN;
  }

  onLogin() {
    this.showFingerprintDialog().then(r => {
      this.w2gService.login(this.l.userEmail.value, this.l.userPass.value).subscribe(
        token => {
          token = token.token;
          localStorage.setItem('token', token.toString());
          this.w2gService.getUserPorEmail(token).subscribe
          (
            (userA: User) => {
              this.user = userA;
              localStorage.setItem('cliente', this.user.toString());
              if (this.isModal){
                this.modalCtrl.dismiss();
                this.router.navigateByUrl('/account');
              }
              else {
                this.router.navigateByUrl('/account');
              }
            }
          );
          this.router.navigateByUrl('/account');
        }
      );
    });
  }


  openUserAccount():void{
    this.router.navigate(['/account']);
  }

  biometricAnalise() {
    this.faio.show({}).then(()=> {
      if ((this.isModal)) {
        this.w2gService.onDismissModal();
        this.router.navigateByUrl('/account');
        this.w2gService.getUserPorEmail(localStorage.getItem('token')).subscribe(c=>{
          this.user=c;
          console.log(this.user);
          this.router.navigateByUrl('/account');
        });
      }
    }).catch((error:any)=>{
      console.log('err: ',error);
    });
  }

  userPINCode=null;
  loginByPin(){
    if (localStorage.getItem('token')!=null){
      this.w2gService.getUserByPIN(this.p.pinInput.value);
      console.log('My Pass:', this.w2gService.userPINCode);
      if (this.p.pinInput.value == this.w2gService.userPINCode){
        this.modalCtrl.dismiss();
      }
    }
  }
}

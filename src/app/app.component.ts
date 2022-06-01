import {Component, HostListener} from '@angular/core';
import {appInitialize} from "@ionic/angular/app-initialize";
import {AlertController, ModalController, Platform} from "@ionic/angular";
import {SplashScreen} from "@ionic-native/splash-screen/ngx";
import {StatusBar} from "@ionic-native/status-bar/ngx";
import {LoginPage} from "./login/login.page";
import {OneSignal} from "@ionic-native/onesignal/ngx";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private platform:Platform,
    private splashScreen:SplashScreen,
    private statusBar:StatusBar,
    private modalCtrl:ModalController,
    private oneSignal:OneSignal,
    private alertCtrl:AlertController
    ) {
    this.initializeApp();
    }

  onTouchStart() {
    //this.restartIdleLogoutTimer();
    console.log('You are touched');
  }

 // idleLogoutTimer;

  ngOnInit() {

  }



  initializeApp(){
    this.platform.ready().then(()=>{
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (this.platform.is('android')){
        this.setupPush();
      }
    });
  }


  setupPush() {
    this.oneSignal.startInit('544cbd67-40e1-4529-8a84-e009f07a4af1','423483095748');
    console.log('This ID Worked');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
    this.oneSignal.handleNotificationReceived().subscribe(data=>{
      let msg=data.payload.body;
      let title=data.payload.title;
      let additionalData=data.payload.additionalData;
      this.showAlert(title,msg,additionalData.task);
    });
    this.oneSignal.handleNotificationOpened().subscribe(data=>{
      let additionalData=data.notification.payload.additionalData;
      this.showAlert('Notification opened','You already read this before', additionalData.task);
    });
    this.oneSignal.endInit();
  }

  async showAlert(title, msg,task){
    const alert=await this.alertCtrl.create({
      header:title,
      subHeader:msg,
      buttons:[
        {
          text:`Action: ${task}`,
          handler:()=>{

          }
        }
      ]
    })
    alert.present();
  }

  async lockApp(){
    const modal= await this.modalCtrl.create({
      component:LoginPage,
      backdropDismiss:false,
      componentProps:{
        isModal:true
      }
    });
    await modal.present();
  }

}

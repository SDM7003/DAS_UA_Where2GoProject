import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Globalization} from "@ionic-native/globalization/ngx";
import {FingerprintAIO} from "@ionic-native/fingerprint-aio/ngx";
import {FormBuilder} from "@angular/forms";
import {AccountPage} from "./account/account.page";
import {OneSignal} from "@ionic-native/onesignal/ngx";
import {SplashScreen} from "@ionic-native/splash-screen/ngx";
import {StatusBar} from "@ionic-native/status-bar/ngx";
import {Storage} from "@ionic/storage";
import { FilterEventPipe } from './filter-event.pipe';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, FilterEventPipe],
  entryComponents: [],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [Globalization, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, FingerprintAIO, FormBuilder,
    AccountPage,OneSignal,SplashScreen,StatusBar, Storage],
  bootstrap: [AppComponent],
})
export class AppModule {}

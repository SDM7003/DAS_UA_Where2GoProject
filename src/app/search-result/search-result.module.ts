import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchResultPageRoutingModule } from './search-result-routing.module';

import {Globalization} from "@ionic-native/globalization/ngx";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import { SearchResultPage } from './search-result.page';
import {HomePageRoutingModule} from "../home/home-routing.module";
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule.forChild({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        SearchResultPageRoutingModule,
        HomePageRoutingModule
    ],
  declarations: [SearchResultPage],
  providers: [Globalization]
})
export class SearchResultPageModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import {HeaderComponent} from "../header/header.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, FormsModule],
    declarations: [
        HeaderComponent
    ],
    exports: [RouterModule, HeaderComponent]
})
export class HomePageRoutingModule {}

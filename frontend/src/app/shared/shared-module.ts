import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Modal } from './modal/modal';



@NgModule({
  declarations: [
    Header,
    Footer,
    Modal
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }

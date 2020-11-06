import { Component, Input, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss'],
})
export class HeaderPage implements OnInit {

  header_data: any;
  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  @Input()
  set header(header_data: any) {
    this.header_data = header_data;
  }
  get header() {
    return this.header_data;
  }

}

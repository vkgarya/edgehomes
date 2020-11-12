import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-testapi',
  templateUrl: './testapi.page.html',
  styleUrls: ['./testapi.page.scss'],
})
export class TestapiPage implements OnInit {

  res: any;
  userAllHomes: any;
  userSpecificHome: any
  error1: any;
  error2: any;
  error3: any;
  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.dataService.getUserAllHomes(16)
      .subscribe((response: any) => this.res = response,
        error => this.error1 = error);


    this.dataService.getUserAllHomes(16)
      .subscribe((response: any) => this.userAllHomes = response?.data,
        error => this.error2 = error);

    this.dataService.getUserSpecificHome(16, 17723)
      .subscribe(
        (response: any) => this.userSpecificHome = response?.data,
        error => this.error3 = error
      );
  }


}

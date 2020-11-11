import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToHome(): void {
    this.router.navigate(['landing']);
  }
  navigateToExplore(): void {
    this.router.navigate(['explore']);
  }
  navigateToSelf(): void{
    this.router.navigate(['self']);
  }
  navigateToFooterMore(): void{
    this.router.navigate(['footer-more']);
  }
}

import { Component, OnInit, OnDestroy, ApplicationRef } from "@angular/core";
import { Subscription, concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { NavController, ToastController, AlertController } from "@ionic/angular";
import { Network } from "@ngx-pwa/offline";
import { SwUpdate, UpdateActivatedEvent, UpdateAvailableEvent } from '@angular/service-worker';
import { EventResponse } from '../interfaces/interfaces';
import { UpdatesService } from '../services/updates.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-add-home',
  templateUrl: './add-home.page.html',
  styleUrls: ['./add-home.page.scss'],
})
export class AddHomePage implements OnInit {

  events: EventResponse[] = [];
  subscriptions: Subscription[] = [];
  online$ = this.network.onlineChanges;
  homes: any = [];
  accessCode: string;
  error: any;

  constructor(private updatesService: UpdatesService,
    private dataService: DataService,
    private nav: NavController,
    private network: Network,
    private updater: SwUpdate,
    private toastController: ToastController,
    private alertController: AlertController,
    private appRef: ApplicationRef,
    private router: Router) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.updatesService.getAll().subscribe(e => this.events.push(e)));
    this.initUpdater();
  }

  addHome(accessCode: string): void {
    this.dataService.registerUserHome(16, accessCode)
      .subscribe(
        home => {
          this.homes.push(home);
          this.router.navigate(['/landing']);
        },
        error => this.error = error
      );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getEvents(): EventResponse[] {
    return this.events.sort((a, b) => a.event.created > b.event.created ? -1 : 1);
  }

  details(response: EventResponse) {
    this.nav.navigateForward(`/add-home/${response.event.id}`);
  }

  initUpdater() {
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    // See https://angular.io/guide/service-worker-communications
    const updateInterval$ = interval(1000 * 60 * 1);  // 1 minute - Just for testing
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const appStableInterval$ = concat(appIsStable$, updateInterval$);

    // Warning! Make sure you use arrow functions here or suffer the wrath of `this`!
    if (this.updater.isEnabled) {
      console.log('Subscribing to updates...');
      this.subscriptions.push(appStableInterval$.subscribe(() => this.checkForUpdate()));
      this.subscriptions.push(this.updater.available.subscribe(e => this.onUpdateAvailable(e)));
      this.subscriptions.push(this.updater.activated.subscribe((e) => this.onUpdateActivated(e)));
    }
  }

  async checkForUpdate() {
    if (this.updater.isEnabled) {
      console.log('Checking for updates...');
      await this.updater.checkForUpdate();
    }
  }

  async onUpdateAvailable(event: UpdateAvailableEvent) {
    const updateMessage = event.available.appData['updateMessage'];
    console.log('A new version is available: ', updateMessage);

    const alert = await this.alertController.create({
      header: 'Update Available!',
      message: 'A new version of the application is available. ' +
        `(Details: ${updateMessage}) ` +
        'Click OK to update now.',
      buttons: [
        {
          text: 'Not Now',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async () => {
            await this.showToastMessage('Update deferred');
          }
        }, {
          text: 'OK',
          handler: async () => {
            await this.updater.activateUpdate();
            window.location.reload();
          }
        }
      ]
    });
    await alert.present();
  }

  async onUpdateActivated(e: UpdateActivatedEvent) {
    await this.showToastMessage('Application updating.');
  }

  async showToastMessage(msg: string) {
    console.log(msg);
    const toast = await this.toastController.create({
      header: 'Alert',
      message: msg,
      duration: 2000,
      keyboardClose: true,
      position: 'top'
    });
    toast.present();
  }

  async doRefresh(event) {
    try {
      const maxEvent = this.events
        .reduce((prev, current) => (prev.event.id > current.event.id) ? prev : current);
      const maxEventId = +maxEvent.event.id + 1;

      const response = await this.updatesService.getById(maxEventId).toPromise();
      this.events.push(response);
    } catch (err) {
      console.error(err);
    } finally {
      event.target.complete();
    }
  }

  navigateToHome(): void {
    this.router.navigate(['landing']);
  }
  navigateToExplore(): void {
    this.router.navigate(['explore']);
  }
  navigateToSelf(): void {
    this.router.navigate(['self']);
  }
  navigateToFooterMore(): void {
    this.router.navigate(['footer-more']);
  }
}

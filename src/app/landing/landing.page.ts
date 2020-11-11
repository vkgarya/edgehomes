import { Component, OnInit, OnDestroy, ApplicationRef } from "@angular/core";
import { Subscription, concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { NavController, ToastController, AlertController } from "@ionic/angular";
import { Network } from "@ngx-pwa/offline";
import { SwUpdate, UpdateActivatedEvent, UpdateAvailableEvent } from '@angular/service-worker';
import { EventResponse } from '../interfaces/interfaces';
import { UpdatesService } from '../services/updates.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  events: EventResponse[] = [];
  subscriptions: Subscription[] = [];
  online$ = this.network.onlineChanges;

  menus: any;
  updates: any;
  searchTerm: string;
  constructor(private updatesService: UpdatesService,
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

    this.menus = [
      { title: '', image: './../../assets/dummy/add-home.png', link: '/add-home' },
      { title: 'Jones Residence', image: './../../assets/dummy/dummy-image.jpg', link: '' },
      { title: 'My Rental', image: './../../assets/dummy/dummy-image.jpg', link: '' },
      { title: 'Townhome', image: './../../assets/dummy/dummy-image.jpg', link: '' },
      { title: 'Other home', image: './../../assets/dummy/dummy-image.jpg', link: '' }
    ];

    this.updates = [
      {
        avatar: './../../assets/dummy/dummy-profile.png',
        title: 'Update on Jones Residence',
        subtitle: '23 minutes ago from John Q.Builder',
        image: './../../assets/dummy/dummy-image.jpg',
        descriptionHTML: '<b>CABINATES ARE IN!</b> I just wanted to get you an update on your home. Click the message icon to let me know if you have any questions!'
      },
      {
        avatar: './../../assets/dummy/dummy-icon.png',
        title: 'Update on Jones Residence',
        subtitle: '23 minutes ago from John Q.Builder',
        image: './../../assets/dummy/dummy-image.jpg',
        descriptionHTML: '<b>CABINATES ARE IN!</b> I just wanted to get you an update on your home. Click the message icon to let me know if you have any questions!'
      }
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setFilteredUpdates(): void {

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
  navigateToSelf(): void{
    this.router.navigate(['self']);
  }
  navigateToFooterMore(): void{
    this.router.navigate(['footer-more']);
  }

}


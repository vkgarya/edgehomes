
import { Component, OnInit, OnDestroy, ApplicationRef } from "@angular/core";
import { Subscription, concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { NavController, ToastController, AlertController } from "@ionic/angular";
import { Network } from "@ngx-pwa/offline";
import { SwUpdate, UpdateActivatedEvent, UpdateAvailableEvent } from '@angular/service-worker';
import { EventResponse } from '../interfaces/interfaces';
import { UpdatesService } from '../services/updates.service';


@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  events: EventResponse[] = [];
  subscriptions: Subscription[] = [];
  online$ = this.network.onlineChanges;

  menus: any;
  floors: any;
  grid: Array<Array<string>>;
  searchTerm: string;
  constructor(private updatesService: UpdatesService,
    private nav: NavController,
    private network: Network,
    private updater: SwUpdate,
    private toastController: ToastController,
    private alertController: AlertController,
    private appRef: ApplicationRef) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.updatesService.getAll().subscribe(e => this.events.push(e)));

    this.initUpdater();

    this.menus = [
      { title: 'FLOOR PLANS', image: './../../assets/dummy/add-home.png', link: '/add-home' },
      { title: 'COMMUNITIES', image: './../../assets/dummy/dummy-image.jpg', link: '' },
      { title: 'QUICK MOVE-INS', image: './../../assets/dummy/dummy-image.jpg', link: '' },
      { title: 'GALLARY', image: './../../assets/dummy/dummy-image.jpg', link: '' }
    ];

    this.floors = [
      {
        homeImage: './../../assets/dummy/dummy-image.jpg',
        homeOwner: 'Tessa'
      },
      {
        homeImage: './../../assets/dummy/dummy-image.jpg',
        homeOwner: 'Quincy'
      },
      {
        homeImage: './../../assets/dummy/dummy-image.jpg',
        homeOwner: 'Morgan'
      },
      {
        homeImage: './../../assets/dummy/dummy-image.jpg',
        homeOwner: 'Emily'
      },
      {
        homeImage: './../../assets/dummy/dummy-image.jpg',
        homeOwner: 'John'
      },
      {
        homeImage: './../../assets/dummy/dummy-image.jpg',
        homeOwner: 'Tom'
      },
      {
        homeImage: './../../assets/dummy/dummy-image.jpg',
        homeOwner: 'Charlie'
      },
      {
        homeImage: './../../assets/dummy/dummy-image.jpg',
        homeOwner: 'Adam'
      },
    ];

    this.grid = Array(Math.ceil(this.floors.length / 2));

    this.ionViewLoaded();
  }

  ionViewLoaded() {
    
    let rowNum = 0;
    
    for (let i = 0; i < this.floors.length; i+=2) {
      
      this.grid[rowNum] = Array(2);

      if (this.floors[i]) {
        this.grid[rowNum][0] = this.floors[i]
      }
      if (this.floors[i+1]) {
        this.grid[rowNum][1] = this.floors[i+1]
      }
    
      rowNum++;
    }
      
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

}

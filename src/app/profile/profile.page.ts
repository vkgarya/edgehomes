import { Component, OnInit, OnDestroy, ApplicationRef } from "@angular/core";
import { Subscription, concat, interval, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { NavController, ToastController, AlertController } from "@ionic/angular";
import { Network } from "@ngx-pwa/offline";
import { SwUpdate, UpdateActivatedEvent, UpdateAvailableEvent } from '@angular/service-worker';
import { EventResponse } from '../interfaces/interfaces';
import { UpdatesService } from '../services/updates.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  events: EventResponse[] = [];
  subscriptions: Subscription[] = [];
  online$ = this.network.onlineChanges;

  profile: any;

  profile$: Observable<any>;
  profileId: string;

  searchTerm: string;
  constructor(private updatesService: UpdatesService,
    private dataService: DataService,
    private nav: NavController,
    private network: Network,
    private updater: SwUpdate,
    private toastController: ToastController,
    private alertController: AlertController,
    private appRef: ApplicationRef,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.updatesService.getAll().subscribe(e => this.events.push(e)));

    this.initUpdater();

    this.profile$ = this.activatedRoute.paramMap.pipe(map(paramMap => paramMap.get('id')));
    this.profileId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getProfileData(this.profileId);

    // this.profile =
    // {
    //   avatar: './../../assets/dummy/dummy-image.jpg',
    //   name: 'John Q. Builder',
    //   title: 'Construction Manager',
    //   code: '901-111-1111x1111',
    //   description: 'Home building is in my DNA. My grandpa was a home builder. My father owned a framing company, and I am honored to be able to carry on the family tradition as a Construction Manager for Edge Homes. When I am not busyt building homes, I enjoy hunting, fishing, or just sitting on a stump in the middle of the great outdoors.',
    //   sendMessageNumber: '+1-1212121212',
    //   sendEmailAddress: '+1-1212121212',
    //   phoneCallNumber: '+1-1212121212',
    // };
  }

  getProfileData(profileId: string): void {
    this.dataService.getBuyerData(profileId)
      .subscribe(
        (response: any) => {
          console.log("response - profile", response);
          this.profile = response.data;
        },
        error => console.log(error)
      );
  }

  segmentChanged(ev: any) {
    //console.log('Segment changed', ev);
    if (ev.detail.value === 'photos') {
      this.nav.navigateForward(`/home/photos`);
    } else if (ev.detail.value === 'design') {
      this.nav.navigateForward(`/home/design`);
    } else if (ev.detail.value === 'progress') {
      this.nav.navigateForward(`/home/progress`);
    } else if (ev.detail.value === 'more') {
      this.nav.navigateForward(`/home/more`);
    }
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
  navigateToSelf(): void{
    this.router.navigate(['self']);
  }
  navigateToFooterMore(): void{
    this.router.navigate(['footer-more']);
  }

}


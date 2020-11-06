import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Acknowledgement, EmergencyEvent, EventResponse } from '../interfaces/interfaces';
import { UpdatesService } from '../services/updates.service';
import { Network } from '@ngx-pwa/offline';

@Component({
  selector: 'app-add-home',
  templateUrl: './add-home.page.html',
  styleUrls: ['./add-home.page.scss'],
})
export class AddHomePage implements OnInit {

  eventId: number;
  eventResponse: EventResponse;
  event: EmergencyEvent;
  acknowledgements: Acknowledgement[] = [];
  newNote = '';
  online$ = this.network.onlineChanges;

  constructor(private route: ActivatedRoute, private updatesService: UpdatesService, private network: Network) { }

  async ngOnInit() {
    this.eventId = +this.route.snapshot.params['eventId'];
    this.eventResponse = await this.updatesService.getById(this.eventId).toPromise();
    this.event = this.eventResponse.event;

    this.acknowledgements = await this.updatesService.getAcknowledgements(this.eventResponse).toPromise();
  }


}

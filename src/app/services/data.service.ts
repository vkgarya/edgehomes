import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private endpoint = environment.endpoint;
  private apiToken = environment.apiToken;

  constructor(private http: HttpClient) { }

  getAuthenticatedUser(){
    let url = `${this.endpoint}/users/self/?api_token=${this.apiToken}`;
    return this.http.get(url);
  }

  getBuyerData(userId) {
    let url = `${this.endpoint}/buyers/${userId}/?api_token=${this.apiToken}`;
    return this.http.get(url);
  }

  getUserAllHomes(userId) {
    let url = `${this.endpoint}/buyers/${userId}/homes?api_token=${this.apiToken}`;
    return this.http.get(url);
  }

  getUserSpecificHome(userId, homeId) {
    let url = `${this.endpoint}/buyers/${userId}/homes/${homeId}?api_token=${this.apiToken}`;
    return this.http.get(url);
  }

  registerUserHome(userId, accessCode): Observable<any> {
    let url = `${this.endpoint}/buyers/${userId}/homes/?api_token=${this.apiToken}`
    let body = { 'link_code': accessCode };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };

    return this.http.post<any>(url, body, httpOptions)
      // .pipe(
      //   retry(3),
      //   catchError(
      //     this.handleError('registerUserHome', body))
      // );
  }

  getNewsFeeds(userId): Observable<any> {
    let url = `${this.endpoint}/buyers/${userId}/news?api_token=${this.apiToken}`;
    return this.http.get(url); 
  }

  getMessages(userId): Observable<any> {
    let url = `${this.endpoint}/buyers/${userId}/messages?api_token=${this.apiToken}`;
    return this.http.get(url); 
  }

  getSpecificMessages(userId, messageId): Observable<any> {
    let url = `${this.endpoint}/buyers/${userId}/messages/${messageId}/items?api_token=${this.apiToken}`;
    return this.http.get(url); 
  }

  getAllCustomerServices(userId): Observable<any> {
    let url = `${this.endpoint}/buyers/${userId}/customer-service?api_token=${this.apiToken}`;
    return this.http.get(url); 
  }

  getSpecificHomeServiceRequests(userId, homeId): Observable<any> {
    let url = `${this.endpoint}/buyers/${userId}/homes/${homeId}/service-requests?api_token=${this.apiToken}`;
    return this.http.get(url); 
  }

  updateSpecificHomeServiceRequests(userId, homeId): Observable<any> {
    let url = `${this.endpoint}/buyers/${userId}/homes/${homeId}/service-requests?api_token=${this.apiToken}`;
    return this.http.patch(url, {}); // PENDING WITH CLIENT 
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }


}

// https://angular.io/guide/http

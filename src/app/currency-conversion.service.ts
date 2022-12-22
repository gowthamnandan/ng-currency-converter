import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConversionService {

  constructor(private http: HttpClient) { }

  public async get(url: string, options?: any) { 
    return await this.http.get(url, options).toPromise();
  } 

  public async post(url: string, data: any, options?: any) { 
    return await this.http.post(url, data, options); 
  } 

  public async put(url: string, data: any, options?: any) { 
    return await this.http.put(url, data, options); 
  } 
  
  public async delete(url: string, options?: any) { 
    return await this.http.delete(url, options); 
  } 
}

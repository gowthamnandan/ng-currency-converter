import { Component, OnInit } from '@angular/core';
import { CurrencyModelService } from './currency-model.service';
import { NgForm } from '@angular/forms';
import { ConversionData, CurrencyModel } from './app-interfaces';
import { FileService } from './../utilities/file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private currencyModelService: CurrencyModelService, private fileService: FileService) {
  }
  appTitle: string = 'Get Currency Rate';
  currencyLists: CurrencyModel[];
  fromCurrency = new Map();
  desiredCurrency = new Map();
  selectedFromCurrency: string = 'CAD';
  selectedToCurrency: string = 'INR';
  bestConversionRate: ConversionData = {
    'path': [''],
    'value': 0
  };

  ngOnInit(){
    this.getCurrency();
  }

  async getCurrency() {
    this.currencyLists = await this.currencyModelService.getCurrency();
    this.currencyLists.forEach((currency) => {
      this.fromCurrency.set(currency.fromCurrencyCode, currency.fromCurrencyName);
      this.desiredCurrency.set(currency.toCurrencyCode, currency.toCurrencyName);
    });
    
  }

  onSubmit(conversionForm: NgForm) {
    if(conversionForm.valid) {
      this.currencyModelService.processData(conversionForm.value);
      this.bestConversionRate = this.currencyModelService.bestConversionRate;
    }
  }


  downloadResults() {
    if(this.currencyModelService.conversionResults) {
      const records = [];
      const headers: string[] = ['Currencycode', 'Country', 'Conversionroute', 'Conversionvalue'];
      for(const [key, val] of this.currencyModelService.conversionResults) {
        const getCode = Object.values(key).slice(-1);
        const data = {
          'currencycode': getCode,
          'country': this.currencyModelService.countryOrCoins.get(getCode[0]),
          'conversionroute': Object.values(key).join('|'),
          'conversionvalue': val
          
        }
        records.push(data);
      }
      this.fileService.csvDownload(headers, records);
    }
  }
}

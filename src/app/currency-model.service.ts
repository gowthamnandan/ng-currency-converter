import { Injectable } from '@angular/core';
import { CurrencyConversionService } from './currency-conversion.service';
import { ConfigService } from './config-service.service';
import { CurrencyModel, ConversionData, CountryCodes } from './app-interfaces'

@Injectable({
  providedIn: 'root'
})
export class CurrencyModelService {

  constructor(private currencyConversionService: CurrencyConversionService, private configService: ConfigService) { }

  baseUrl = this.configService.getApi('baseUrl');
  currencyUrl = this.configService.getApi('getCurrencyConversion');
  conversionData;
  conversionResults;
  bestConversionRate:ConversionData;
  countryOrCoins = new Map();

  /**getCurrency returns the date from currency exchange API
   * and stores an object model `conversionData` for later usage purpose
  */
  async getCurrency(): Promise< CurrencyModel[] | undefined > {
    const endpoint = this.baseUrl + this.currencyUrl;
    this.conversionData = await this.currencyConversionService.get(endpoint);
    return this.conversionData;
  }

  /** @Input param - Currency coversion rates from API 
   * this method process the data to find out best coversion range 
   * among varios currency exchanges
   * @returns the all possible conversion results with the currency code
   * and exchange values
  */
  processData(receivedData) {
    const { fromAmount, fromCurrency, toCurrency } = receivedData;
    if(fromCurrency === toCurrency) {
      return;
    }
    const records1 = new Map();
    for(const conversion of this.conversionData) {
      // Direct coversion price checking if any ex- CAD to HKD (1 to 1)
      if(conversion.fromCurrencyCode === fromCurrency && conversion.toCurrencyCode === toCurrency) {
        const conversionRate = fromAmount * conversion.exchangeRate;
        records1.set({fromCurrency, toCurrency}, conversionRate);
        // setting initial exchange value
        this.bestConversionRate = {
          "path": [fromCurrency, toCurrency],
          "value": conversionRate
        }
      }
      // 2nd option from current currency to next possible/available currency check
      if(conversion.fromCurrencyCode === fromCurrency && conversion.toCurrencyCode !== toCurrency) {
        const conversionRate = fromAmount * conversion.exchangeRate;
        const tempToCurrency = conversion.toCurrencyCode;
        records1.set({fromCurrency, tempToCurrency}, conversionRate);
      }
      // Updating country and currency code for data mapping while downloading the file
      this.countryOrCoins.set(conversion.toCurrencyCode, this.removeLastWord(conversion.toCurrencyName));
    }

    // 3rd iteration check among the intermediate exchanged values
    const records2 = new Map();
    for(const [key, value] of records1.entries()) {
      if(key.tempToCurrency) {
      const fromCurrency = key.fromCurrency;
      const toCurrency = key.tempToCurrency;
        for(const conversion of this.conversionData) {
          if(conversion.fromCurrencyCode === key.tempToCurrency && conversion.toCurrencyCode !== key.fromCurrency ) {
            const conversionRate = value * conversion.exchangeRate;
            const tempToCurrency = conversion.toCurrencyCode;
            records2.set({fromCurrency, toCurrency, tempToCurrency}, conversionRate);
          }

        }
      }
    }
    // final conversion
    const records3 = new Map();
    for(const [key, value] of records2.entries()) {
      const fromCurrency = key.fromCurrency;
      const tempToCurrency = key.toCurrency;
      const finalFromCurrency = key.tempToCurrency;
      if(finalFromCurrency !== toCurrency) {
        for(const conversion of this.conversionData) {
          if(conversion.fromCurrencyCode === finalFromCurrency && conversion.toCurrencyCode === toCurrency) {
            const conversionRate = value * conversion.exchangeRate;
            records3.set({fromCurrency, tempToCurrency, finalFromCurrency, toCurrency}, conversionRate);
          }
        }
      }
    }
    
    if(records3) {
      const entries = [...records3.entries()];
      this.bestConversionRate = {
        "path": Object.values(entries[0][0]),
        "value": entries[0][1]
      }
    }
    this.conversionResults = new Map([...records1, ...records2, ...records3]);
  }

  /** Removes last word if the word length is more than one
   * which means we need Bitcoin as it is 
   * and Japan yen should return Japan
  */
  removeLastWord(str) {
    const words = str.split(' ');
    if (words.length === 1) {
      return str;
    }
    return words.slice(0, -1).join(' ');
  }
}

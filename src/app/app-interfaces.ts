export interface ConfigProperties {
    debugging: boolean;
    API_ENDPOINTS: { 
      baseUrl: string;
      getCurrencyConversion: string
    }
  }

export interface CurrencyModel {
  exchangeRate: number;
  fromCurrencyCode: string;
  fromCurrencyName: string;
  toCurrencyCode: string;
  toCurrencyName: string;
}

export interface ConversionData {
  path: string[],
  value: number
}

export interface CountryCodes {
  currencyCode: string,
  currencyCountry: string
}
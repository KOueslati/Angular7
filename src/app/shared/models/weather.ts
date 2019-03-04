import { City } from './city';
import { CurrentConditions, Temperature } from './current-conditions';

export class Weather {
  Location: string;
  WeatherText: string;
  WeatherIconUrl: string;
  IsDayTime: boolean;
  TemperatureUnit: string;
  TemperatureValue: number;

  constructor(city: City, currentConditions: CurrentConditions) {
    this.Location = city.EnglishName;
    this.WeatherText = currentConditions.WeatherText;
    this.IsDayTime = currentConditions.IsDayTime;
    if (currentConditions.WeatherIcon) {
      this.WeatherIconUrl = `/assets/images/${currentConditions.WeatherIcon}.png`;
    }
    if (currentConditions.Temperature != null && currentConditions.Temperature.Metric != null) {
      this.TemperatureUnit = currentConditions.Temperature.Metric.Unit;
      this.TemperatureValue = currentConditions.Temperature.Metric.Value;
    }
  }
}

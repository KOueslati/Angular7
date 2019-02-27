export interface CurrentConditions {
  LocalObservationDateTime: string;
  WeatherText: string;
  WeatherIcon: string;
  IsDayTime: boolean;
  Temperature: Temperature;
}
export interface Metric {
  Value: number;
  Unit: string;
  UnitType: number;
}

export interface Imperial {
  Value: number;
  Unit: string;
  UnitType: number;
}

export interface Temperature {
  Metric: Metric;
  Imperial: Imperial;
}

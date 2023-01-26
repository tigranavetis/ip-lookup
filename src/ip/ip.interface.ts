export type Ip = {
  ip: string;
  success: boolean;
  type: string;
  continent: string;
  continent_code: string;
  country: string;
  country_code: string;
  region: string;
  region_code: string;
  city: string;
  latitude: number;
  longitude: number;
  is_eu: boolean;
  postal: string;
  calling_code: string;
  capital: string;
  borders: string;
  flag: IpFlag;
  connection: IpConnection;
  timezone: IpTimezone;
};

type IpFlag = {
  img: string;
  emoji: string;
  emoji_unicode: string;
};

type IpConnection = {
  asn: number;
  org: string;
  isp: string;
  domain: string;
};

type IpTimezone = {
  id: string;
  abbr: string;
  is_dst: boolean;
  offset: number;
  utc: string;
  current_time: string;
};

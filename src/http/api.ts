import axios from "axios";
import { appSetting } from "../constants/app-setting/config.const";
import { HttpClientFactory } from "../helpers/adapter";

export const httpClientAxios = HttpClientFactory.createHttpClient(
  "axios",
  appSetting.baseUrl,
  {
    withCredentials: true,
  },
);

// Tools
export const apiBase2b = axios.create({
  baseURL: "https://base2b.online:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiCheckOperadora = axios.create({
  baseURL: "https://zapchecker.bigdates.com.br/api/public",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": "sMVD95wfLe3WDLP5b3DQfBNjzdb8dZ",
  },
});
export const apiPurchase = axios.create({
  baseURL: "https://evolution.bigdates.com.br:3620",
  headers: {
    "Content-Type": "application/json",
  },
});

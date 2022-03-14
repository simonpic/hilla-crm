import { CrmStore } from "./crm-store";

export class AppStore {
  crmStore = new CrmStore();
}
export const appStore = new AppStore();
export const crmStore = appStore.crmStore;

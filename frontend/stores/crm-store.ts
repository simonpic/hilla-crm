import { makeAutoObservable, observable, runInAction } from "mobx";

import Company from "Frontend/generated/com/example/application/data/entity/Company";
import Contact from "Frontend/generated/com/example/application/data/entity/Contact";
import Status from "Frontend/generated/com/example/application/data/entity/Status";
import { CrmEndpoint } from "Frontend/generated/endpoints";
import { uiStore } from "./app-store";
import { cacheable } from "./cacheable";
import CrmDataModel from "Frontend/generated/com/example/application/data/endpoint/CrmEndpoint/CrmDataModel";

export class CrmStore {
    contacts: Contact[] = [];
    companies: Company[] = [];
    statuses: Status[] = [];

    constructor() {
        makeAutoObservable(
            this,
            {
                initFromServer: false,
                contacts: observable.shallow,
                companies: observable.shallow,
                statuses: observable.shallow,
            },
            { autoBind: true}
        );

        this.initFromServer();
    }

    async initFromServer() {

        const data = await cacheable(
            CrmEndpoint.getCrmData,
            'crm',
            CrmDataModel.createEmptyValue()
        );

        runInAction(() => {
            this.contacts = data.contacts;
            this.companies = data.companies;
            this.statuses = data.statuses;
        });
    }

    async saveContact(contact: Contact) {
        try {
            const saved = await CrmEndpoint.saveContact(contact);
            if (saved) {
                this.saveLocal(saved);
                uiStore.showSuccess('Contact saved')
            } else {
                uiStore.showError('Contact save failed')
            }
        } catch (e) {
            uiStore.showError('Contact save failed')
        }
    }

    async deleteContact(contact: Contact) {
        if (!contact.id) return;
        
        try {
            await CrmEndpoint.deleteContact(contact.id);
            this.deleteLocal(contact);
            uiStore.showSuccess('Contact deleted')
        } catch(e) {
            uiStore.showError('Contact save failed')
        }
    }

    private saveLocal(contact: Contact) {
        const contactExists = this.contacts.some(c => c.id === contact.id);
        
        if (contactExists) {
            this.contacts = this.contacts
            .map(existing => existing.id === contact.id ? contact : existing);
        } else {
            this.contacts.push(contact);
        }
    }

    private deleteLocal(contact: Contact) {
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
    }
}
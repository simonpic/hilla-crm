import { html } from "lit";
import { customElement } from "lit/decorators";
import { View } from "Frontend/views/view";
import '@vaadin/button'
import '@vaadin/combo-box'
import '@vaadin/text-field'
import { Binder, field } from "@hilla/form";
import ContactModel from "Frontend/generated/com/example/application/data/entity/ContactModel";
import { crmStore, uiStore } from "Frontend/stores/app-store";
import { listViewStore } from "Frontend/stores/list-view-store";

@customElement('contact-form')
export class ContactForm extends View {
    protected binder = new Binder(this, ContactModel);

    constructor() {
        super();
        this.autorun(() => {
            if (listViewStore.selectedContact) {
                this.binder.read(listViewStore.selectedContact);
            } else {
                this.binder.clear();
            }
        });
    }

    render() {
        const { model } = this.binder;

        return html`
            <vaadin-text-field 
                label="First name"
                ${field(model.firstName)}
                ?disabled=${uiStore.offline}>
            </vaadin-text-field>
            <vaadin-text-field 
                label="Last name"
                ${field(model.lastName)}
                ?disabled=${uiStore.offline}>
            </vaadin-text-field>
            <vaadin-text-field 
                label="Email"
                ${field(model.email)}
                ?disabled=${uiStore.offline}>
            </vaadin-text-field>
            <vaadin-combo-box 
                label="Status"
                ${field(model.status)}
                item-label-path="name"
                .items=${crmStore.statuses}
                ?disabled=${uiStore.offline}>
            </vaadin-combo-box>
            <vaadin-combo-box 
                label="Company"
                ${field(model.company)}
                item-label-path="name"
                .items=${crmStore.companies}
                ?disabled=${uiStore.offline}>
            </vaadin-combo-box>

            <div class="flex gap-s">
                <vaadin-button 
                    theme="primary" 
                    @click=${this.save}
                    ?disabled=${this.binder.invalid || uiStore.offline}>
                    ${this.binder.value.id ? 'Save' : 'Create'}
                </vaadin-button>
                <vaadin-button 
                    theme="error" 
                    @click=${listViewStore.delete}
                    ?disabled=${uiStore.offline}>
                    Delete
                </vaadin-button>
                <vaadin-button 
                    theme="tertiary"
                    @click=${this.cancel}>
                    Cancel
                </vaadin-button>
            </div>
        `;
    }

    async save() {
        await this.binder.submitTo(listViewStore.save);
        this.binder.clear();
    }

    async cancel() {
        listViewStore.cancelEdit();
        this.binder.clear();
    }
}
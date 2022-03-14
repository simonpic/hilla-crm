import { html } from "lit";
import { customElement } from "lit/decorators";
import { View } from "Frontend/views/view";
import '@vaadin/button'
import '@vaadin/combo-box'
import '@vaadin/text-field'

@customElement('contact-form')
export class ContactForm extends View {
    render() {
        return html`
            <vaadin-text-field label="First name"></vaadin-text-field>
            <vaadin-text-field label="Last name"></vaadin-text-field>
            <vaadin-text-field label="Email"></vaadin-text-field>
            <vaadin-combo-box label="Status"></vaadin-combo-box>
            <vaadin-combo-box label="Company"></vaadin-combo-box>

            <div class="flex gap-s">
                <vaadin-button theme="primary">Save</vaadin-button>
                <vaadin-button theme="error">Delete</vaadin-button>
                <vaadin-button theme="tertiary">Cancel</vaadin-button>
            </div>
        `
    }
}
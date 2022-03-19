import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators";
import { LoginFormLoginEvent } from "@vaadin/login/vaadin-login-form";
import '@vaadin/login/vaadin-login-form'
import { uiStore } from "Frontend/stores/app-store";
import { View } from "../view";


@customElement('login-view')
export class LoginView extends View {
    @state()
    private error = false;

    connectedCallback(): void {
        super.connectedCallback();
        this.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
        uiStore.setLoggedIn(false);
    }

    render() {
        return html`
            <h1>Hilla CRM</h1>
            <vaadin-login-form
                no-forgot-password
                @login=${this.login}
                .error=${this.error}
                ?disabled=${uiStore.offline}>
            </vaadin-login-form>
            ${uiStore.offline
                ? html` <b>You are offline. Login is only available while online.</b> `
                : nothing
            }
        `
    }

    async login(e: LoginFormLoginEvent) {
        try {
            await uiStore.login(e.detail.username, e.detail.password);
        } catch (err) {
            this.error = true;
        }
    }
}

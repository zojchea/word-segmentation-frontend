import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import {map, reduce} from "rxjs/operators";
import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

import {environment} from "../environments/environment";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    private readonly baseUrl = environment.backendUrl
    text = "";
    textDividedBySyllables = "";

    constructor(private http: HttpClient) {
    }

    async validateAndFetchSyllables() {
        if (/[a-zA-Z]+/.test(this.text)) {
            await this.showAlert('Ве молиме внесете текст на кирилица!');
            return;
        } else if (this.text.replace(/[^\u0400-\u04FF` ]/g, ' ').trim().length < 1) {
            await this.showAlert('Мора да внесете текст!');
            return;
        }

        this.textDividedBySyllables = ""

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };

        this.http.get(this.baseUrl + '/divide/syllables?text=' + encodeURIComponent(this.text.replace(/[^\u0400-\u04FF` ]/g, '')), httpOptions).pipe(
            map((response: any) => {
                console.log(response);
                this.textDividedBySyllables = response.trim()

                return response;
            })
        ).subscribe((response) => {
            console.log('Response:', response);
        });
    }

    private async showAlert(message: string) {
        await Swal.fire({
            icon: 'warning',
            html: `<div class="swal-alert-html">${message}</div>`,
            customClass: {
                confirmButton: 'my-confirm-button',
                popup: 'my-sweet-alert-popup'

            },
            buttonsStyling: false
        });
    }

    updateWord(event: any) {
        this.text = event.target.value
    }
}

import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class FormService {
    builderInstance:FormBuilder;
    constructor(fb:FormBuilder){
        this.builderInstance=fb;
    }

    validate(form:FormGroup):boolean{
        if(form.valid) return true;
        form.markAllAsTouched();
        alert("There are errors in your form please fix and retry")
        return false;
    }
}
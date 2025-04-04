import { FormControl, FormGroup } from "@angular/forms";


export type userForm = FormGroup<{
    id: FormControl<string>,
    firstName: FormControl<string>,
    lastName: FormControl<string>,
    email: FormControl<string>,
    userName: FormControl<string>,
    password: FormControl<string>,
    role: FormControl<string>,
}>

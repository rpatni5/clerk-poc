import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { userForm } from '../../../../types/forms/addUserForm';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormService } from '../../../../types/service/formService';
import { UserModel } from '../../../../model/userModel';

@Component({
  selector: 'app-add-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule, MatDialogModule,
    FormsModule, MatFormFieldModule, MatInputModule,

  ],

  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.scss'
})

export class AddUsersComponent {
  addForm!: userForm;

  constructor(
    private formService: FormService,
  ) { }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    this.addForm = this.formService.builderInstance.group({
      id: new FormControl<string>('', { nonNullable: true }),
      firstName: new FormControl<string>('', { nonNullable: true }),
      lastName: new FormControl<string>('', { nonNullable: true }),
      email: new FormControl<string>('', { nonNullable: true }),
      userName: new FormControl<string>('', { nonNullable: true }),
      password: new FormControl<string>('', { nonNullable: true }),
      role: new FormControl<string>('', { nonNullable: true }),
    });
  }

  async onSubmit() {
    if (!this.formService.validate(this.addForm)) {
      return;
    }
    let userData = this.addForm.getRawValue();
    let model: UserModel = {};
    model.id = userData.id;
    model.firstName = userData.firstName;
    model.lastName = userData.lastName;
    model.email = userData.email;
    model.username = userData.userName;
    model.password = userData.password;
    model.role = userData.role;

    if (this.addForm.valid) {
      console.log("User Data ", model);
    } else {
      this.addForm.markAllAsTouched();
    }
  }
}
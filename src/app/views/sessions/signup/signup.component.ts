import { Component, OnInit, ViewChild } from "@angular/core";
import { MatProgressBar, MatButton } from "@angular/material";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { ApplicationUser } from "../signup/user";
import { AuthService } from "../../../services/auth.service";
import { Message } from "primeng/components/common/api";
import { Router } from "@angular/router";
import { FormErrorStateMatcher } from "../../../error-state-matcher";
import { HTTPStatus } from '../../../app.interceptor';

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  model: ApplicationUser;
  msgs: Message[] = [];
  password: any;
  confirmPassword: any;
  passwordNotMatched: any = false;
  passwordMatched: any = false;
  loader = false;
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email
  ]);
  matcher = new FormErrorStateMatcher();

  signupForm: FormGroup;
  constructor(private authService: AuthService, private httpStatus: HTTPStatus, private router: Router) {
    this.model = new ApplicationUser();
    this.showLoader();
  }

  ngOnInit() {
    const password = new FormControl("", Validators.required);
    const confirmPassword = new FormControl(
      "",
      CustomValidators.equalTo(password)
    );

    this.signupForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: password,
      confirmPassword: confirmPassword,
      agreed: new FormControl("", (control: FormControl) => {
        const agreed = control.value;
        if (!agreed) {
          return { agreed: true };
        }
        return null;
      })
    });
  }

  signup() {
    const signupData = this.signupForm.value;
    console.log(signupData);

    this.submitButton.disabled = true;
    this.progressBar.mode = "indeterminate";
  }

  register() {
    this.msgs = [];
    this.loader = false;
    this.authService.createUser(this.model).subscribe(response => {
      if (response.status === 201) {
        this.msgs.push({
          severity: "success",
          detail: "You are successfully created your account!"
        });
        setTimeout(() => {
          this.router.navigate(["/"]);
        }, 5000);
      } else if (response.status === 226) {
        this.msgs.push({
          severity: "error",
          summary: "Account with the same email exist"
        });
      } else {
        this.msgs.push({
          severity: "error",
          summary: "Unable to create account"
        });
      }
    });
  }
  passwordFunction(passwordValue) {
    this.password = passwordValue;
    this.passwordMatchedFunction(this.password, this.confirmPassword);
  }

  confirmPasswordFunction(confirmPasswordValue) {
    this.confirmPassword = confirmPasswordValue;
    this.passwordMatchedFunction(this.password, this.confirmPassword);
  }

  passwordMatchedFunction(pwd, confpwd) {
    //  console.log("password value is :" + pwd);
    //  console.log("confirm password value is :" + confpwd);
    if (pwd == confpwd) {
      // console.log("matched");
      this.passwordMatched = true;
      this.passwordNotMatched = false;
    } else {
      // console.log("not matched");
      this.passwordNotMatched = true;
      this.passwordMatched = false;
    }
  }
  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
      //  console.log(status);
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ApplicationUser } from '../signup/user';
import { Message } from 'primeng/components/common/api';
import { AuthService } from '../../../services/auth.service';
import { TokenStorage } from '../../../token.storage';
import { Router, ActivatedRoute } from '@angular/router';
import { HTTPStatus } from '../../../app.interceptor';
const TOKEN_PREFIX = 'Bearer ';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  model: ApplicationUser;
  msgs: Message[] = [];
  headers: string[];
  loader = false ;
  
  signinForm: FormGroup;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private token: TokenStorage,
    private router: Router,
    private httpStatus: HTTPStatus
  ) {
    this.model = new ApplicationUser();
    this.showLoader();
   }

  ngOnInit() {
    this.signinForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false)
    })
  }

  signIn() {
    this.authService.login(this.model).subscribe(
      resp => {
        if (resp.body && resp.body.token && resp.body.userId) {
          console.log(resp.body);
          this.token.saveToken(TOKEN_PREFIX + resp.body.token);
          console.log(this.model.username);
          this.token.saveUserId(resp.body.userId);
          this.token.saveProperty(resp.body.property);
          this.token.savePropertyId(resp.body.property.id);
          this.token.saveRoomTypes(resp.body.rooms);
          this.loader = false;
        }
        console.log(this.model.id);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        console.log(returnUrl);
        console.log([returnUrl || 'bookone']);
        this.router.navigate([returnUrl || 'bookone']);

      },
      error => {
        if (error.status === 401) {
          this.msgs = [];
          this.msgs.push({
            severity: 'error',
            summary: 'Invalid Username or Password.'
          });
        } else {
          this.msgs.push({
            severity: 'error',
            summary: 'Please try again later.'
          });
        }
      }
    );
  }
  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
    //  console.log(status);
    });
  }

}

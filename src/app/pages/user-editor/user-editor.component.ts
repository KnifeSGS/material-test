import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { switchMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {

  user$: Observable<User> = new Observable<User>();
  genders: string[] = ['Male', 'Female']

  constructor(
    private userService: UserService,
    private ar: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.user$ = this.ar.params.pipe(
      // switchMap(params => (this.userService.get(params.id) as Observable<User>))
      switchMap(params => this.userService.get(params.id))
    )
  }

  formatLabel(value: number): string {
    return Math.round(value / 1000) + 'k';
  }

  async onSubmit(ngForm: NgForm, user: User): Promise<any> {
    await this.userService.update(user);
    return history.back();
  }

}

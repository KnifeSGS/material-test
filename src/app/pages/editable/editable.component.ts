import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/model/user';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-editable',
  templateUrl: './editable.component.html',
  styleUrls: ['./editable.component.scss']
})
export class EditableComponent implements OnInit {

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'gender',
    'email',
    'address',
    'actions',
  ];
  pageSizes: number[] = [5, 10, 25, 50, 100];
  dataSubscription!: Subscription;
  currentFilterKey!: string;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
  ) {
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.userService.getAll()

    this.dataSource.paginator = this.paginator;
    this.dataSubscription = this.userService.userList.subscribe(
      users => this.dataSource.data = (users as unknown as User[])
    );

    this.dataSource.filterPredicate = (data: User | any, filter: string) => {
      const key = this.currentFilterKey || '';
      const source = key ? String(data[key]) : JSON.stringify(data);
      return source.toLowerCase().includes(filter.toLowerCase());
    }
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe()
  }

  onEdit(user: User): void {
    this.router.navigate(['editable', 'edit', user.id])
  }

  onDelete(user: User): void {
    const dialogData = {
      title: 'Are you sure?',
      content: 'The user will be deleted permanently.',
      template: this.dialogTemplate
    };
    this.messageService.openDialog(dialogData).pipe(
      take(1)
    ).subscribe(
      result => {
        if (!result) {
          return
        }
        this.userService.remove(user);
        this.messageService.openSnackBar(3000, 'User deleted successfully.')
      }
    )
  }
}

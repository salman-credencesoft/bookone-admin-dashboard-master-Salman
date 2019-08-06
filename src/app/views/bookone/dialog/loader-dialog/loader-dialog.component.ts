import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-loader-dialog',
  templateUrl: './loader-dialog.component.html',
  styleUrls: ['./loader-dialog.component.scss']
})
export class LoaderDialogComponent implements OnInit {
 @Input() showLoader: boolean;
  constructor(
   // public dialogRef: MatDialogRef<LoaderDialogComponent>,
   // @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit() {
    console.log(this.showLoader);
  }
}

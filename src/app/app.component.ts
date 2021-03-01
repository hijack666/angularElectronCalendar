import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { error } from 'protractor';
import { from, Observable } from 'rxjs';
import { ElectronService } from './core/electron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private electronService: ElectronService,
  ) {}

  ngOnInit() {

  }
}

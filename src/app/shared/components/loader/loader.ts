import { Component } from '@angular/core';
import { LoaderService } from '../../../core/services/loader';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class Loader {
  constructor(public loaderService: LoaderService) {}
}

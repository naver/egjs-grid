import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ["../../../../../../stories/templates/default.css"],
})
export class AppComponent {
  @Input() sizeWeight: any;
  @Input() ratioWeight: any;
  @Input() aspectRatio: any;
  @Input() key: any;
  trackBy = () => this.key;
}

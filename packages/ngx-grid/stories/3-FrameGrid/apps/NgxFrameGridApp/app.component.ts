import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ["../../../../../../stories/templates/default.css"],
})
export class AppComponent {
  @Input() frame: any;
  @Input() rectSize: any;
  @Input() useFrameFill: any;
  @Input() key: any;
  trackBy = () => this.key;
}

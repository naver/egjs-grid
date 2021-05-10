import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ["../../../../../../stories/templates/default.css"],
})
export class AppComponent {
  @Input() defaultDirection: any;
  @Input() gap: any;
  @Input() align: any;
  @Input() column: any;
  @Input() columnSize: any;
  @Input() columnSizeRatio: any;
  @Input() key: any;
  trackBy = () => this.key;
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ["../../../../../../stories/templates/default.css"],
})
export class AppComponent {
  @Input() defaultDirection: any;
  @Input() gap: any;
  @Input() columnRange: any;
  @Input() rowRange: any;
  @Input() sizeRange: any;
  @Input() isCroppedSize: any;
  @Input() displayedRow: any;
  @Input() stretch!: any;
  @Input() stretchRange!: any;
  @Input() passUnstretchRow!: any;
  @Input() key: any;
  trackBy = () => this.key;
}

import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { NgxMasonryGridComponent } from '../../../../projects/ngx-grid/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ["../../../../../../stories/templates/default.css"],
})
export class AppComponent {
  @ViewChild("grid") grid!: NgxMasonryGridComponent;
  @ViewChild("result") resultRef!: ElementRef<HTMLDivElement>;
  @Input() defaultDirection: any;
  @Input() gap: any;
  @Input() align: any;
  @Input() column: any;
  @Input() columnSize: any;
  @Input() columnSizeRatio: any;
  @Input() key: any;
  trackBy = () => this.key;

  onRenderComplete(e: any) {
    this.resultRef.nativeElement!.innerHTML = `updated: ${e.updated.length}`;
  }
  onClick() {
    const items = this.grid.getItems();

    items[1].element!.style.height = "150px";
    this.grid.updateItems([items[1]]);
  }
}

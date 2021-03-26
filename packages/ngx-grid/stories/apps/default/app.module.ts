import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { NgxGridModule } from "../../../projects/ngx-grid/src/public-api";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxGridModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

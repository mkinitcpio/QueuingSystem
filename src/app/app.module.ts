import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SourceTasksComponent } from './source-tasks/source-tasks.component';
import { QueuingSystemComponent } from './queuing-system/queuing-system.component';
import { RejectedTasksComponent } from './rejected-tasks/rejected-tasks.component';
import { CompletedTasksComponent } from './completed-tasks/completed-tasks.component';
import { AccumulatorComponent } from './accumulator/accumulator.component';
import { PhaseComponent } from './phase/phase.component';


@NgModule({
  declarations: [
    AppComponent,
    SourceTasksComponent,
    QueuingSystemComponent,
    RejectedTasksComponent,
    CompletedTasksComponent,
    AccumulatorComponent,
    PhaseComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

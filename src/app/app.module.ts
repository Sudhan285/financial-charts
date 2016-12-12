import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { DataService } from './services/data.service';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { StocksComponent } from './stocks/stocks.component';
import { CurrencyComponent } from './currency/currency.component';

const routing = RouterModule.forRoot([
    { path: '',      component: HomeComponent },
    { path: 'stocks',      component: StocksComponent },
    { path: 'currency', component: CurrencyComponent }
]);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StocksComponent,
    CurrencyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    ChartsModule
  ],
  providers: [
    DataService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }

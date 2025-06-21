import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { graphqlConfig } from './graphql.config';

// Feature modules
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';

// Components
import { HomeComponent } from './home/home.component';

// Interceptors
import { TokenInterceptor } from './auth/interceptors/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    SharedModule
  ],
  providers: [
    Apollo,
    graphqlConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

/**
 * AWS Amplify.
 * https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js#top-level-configuration-1
 */
 import { Amplify } from 'aws-amplify';

 Amplify.configure({
    // Auth: {
    //   identityPoolId: 'xxx',
    //   region: 'xxx',
    //   cookieStorage: {
    //     domain: 'xxx',
    //     path: 'xxx',
    //     secure: true
    //   }
    // },
    aws_appsync_graphqlEndpoint: 'https://hfchyxrci5abpgghzo4cgjmvse.appsync-api.us-west-2.amazonaws.com/graphql',
    aws_appsync_region: 'us-west-2',
    aws_appsync_authenticationType: 'API_KEY',
    aws_appsync_apiKey: 'da2-2m5o7a4ynfbprmcjlla3g5nuxm'
  });

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
    bootstrap: [AppComponent]
})
export class AppModule {}

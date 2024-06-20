import { ApplicationConfig } from '@angular/core';
import {provideRouter, UrlSerializer} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {IMAGE_CONFIG} from "@angular/common";
import {LowerCaseUrlSerializer} from "@utils/classes/lower-case-url-serializer";
import {authInterceptor} from "@utils/interceptor/auth.interceptor";
import {errorInterceptor} from "@utils/interceptor/error.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClient(withInterceptors([errorInterceptor])),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        placeholderResolution: 40
      }
    },
    {
      provide: UrlSerializer,
      useClass: LowerCaseUrlSerializer
    }
  ]
};

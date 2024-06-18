import { ApplicationConfig } from '@angular/core';
import {DefaultUrlSerializer, provideRouter, UrlSerializer, UrlTree} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import {IMAGE_CONFIG} from "@angular/common";
import {LowerCaseUrlSerializer} from "@utils/classes/lower-case-url-serializer";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
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

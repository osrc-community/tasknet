import {Component, inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgForOf, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'component-home',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    NgTemplateOutlet
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  router = inject(Router)
  platformId = inject(PLATFORM_ID)

  panels = [
    {
      group: "TaskNet",
      image: "assets/images/nature/mountains.jpg",
      panel_name: "Aufgaben",
      url: "/bfrs71834rncs"
    },
    {
      group: "SPH",
      image: "assets/images/nature/aurora.jpg",
      panel_name: "1.0",
      url: "/bfrs71834rncs"
    },
    {
      group: "Q4",
      image: "assets/images/nature/forest_red.jpg",
      panel_name: "Stuff",
      url: "/bfrs71834rncs"
    },
    {
      group: "Games",
      image: "assets/images/nature/flowers.jpg",
      panel_name: "Kicker",
      url: "/bfrs71834rncs"
    },
    {
      group: "Games",
      image: "assets/images/nature/snow.jpg",
      panel_name: "Dart",
      url: "/bfrs71834rncs"
    },
  ]

  scrollLeft() {
    if (isPlatformBrowser(this.platformId)) {
      let panels = document.getElementById('Panels')
      if (panels) {
        let distance = panels.scrollLeft - 320;
        panels.scrollTo({ top: 0, left: distance, behavior: "smooth" });
      }
    }
  }

  scrollRight() {
    if (isPlatformBrowser(this.platformId)) {
      let panels = document.getElementById('Panels')
      if (panels) {
        let distance = panels.scrollLeft + 320;
        panels.scrollTo({ top: 0, left: distance, behavior: "smooth" });
      }
    }
  }
}

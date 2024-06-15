import {Component, inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgForOf, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {Router} from "@angular/router";
import {Panel} from "@utils/interfaces/panel";
import {Group} from "@utils/interfaces/group";

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

  groups: Group[] = [
    {
      identifier: "v348hfn3r8524",
      title: "Games",
      panels: [
        {
          image: "assets/images/nature/snow.jpg",
          title: "Dart",
          identifier: "243bf5u3742dh8n4c"
        },
        {
          image: "assets/images/nature/flowers.jpg",
          title: "Kicker",
          identifier: "bfrs71834rncs"
        },
        {
          image: "assets/images/nature/snow.jpg",
          title: "Dart",
          identifier: "243bf5u3742dh8n4c"
        },
        {
          image: "assets/images/nature/snow.jpg",
          title: "Dart",
          identifier: "243bf5u3742dh8n4c"
        },
        {
          image: "assets/images/nature/snow.jpg",
          title: "Dart",
          identifier: "243bf5u3742dh8n4c"
        },
        {
          image: "assets/images/nature/snow.jpg",
          title: "Dart",
          identifier: "243bf5u3742dh8n4c"
        },
        {
          image: "assets/images/nature/snow.jpg",
          title: "Dart",
          identifier: "243bf5u3742dh8n4c"
        },
      ]
    },
    {
      identifier: "1324r3f534rf",
      title: "Q4",
      panels: [
        {
          image: "assets/images/nature/forest_red.jpg",
          title: "Stuff",
          identifier: "bfrs71834rncs"
        },
        {
          image: "assets/images/nature/forest_red.jpg",
          title: "Stuff",
          identifier: "bfrs71834rncs"
        },
        {
          image: "assets/images/nature/forest_red.jpg",
          title: "Stuff",
          identifier: "bfrs71834rncs"
        },
        {
          image: "assets/images/nature/forest_red.jpg",
          title: "Stuff",
          identifier: "bfrs71834rncs"
        },
        {
          image: "assets/images/nature/forest_red.jpg",
          title: "Stuff",
          identifier: "bfrs71834rncs"
        },
      ]
    },
    {
      identifier: "324357t4n8j24d",
      title: "SPH",
      panels: [
        {
          image: "assets/images/nature/aurora.jpg",
          title: "1.0",
          identifier: "bfrs71834rncs"
        },
        {
          image: "assets/images/nature/aurora.jpg",
          title: "1.0",
          identifier: "bfrs71834rncs"
        },
      ]
    },
    {
      identifier: "huwh32437erhvunc2u47r8fm",
      title: "TaskNet",
      panels: [
        {
          image: "assets/images/nature/mountains.jpg",
          title: "Aufgaben",
          identifier: "bfrs71834rncs"
        }
      ]
    }
  ]

  scrollLeft(element_id: string) {
    if (isPlatformBrowser(this.platformId)) {
      let panels = document.getElementById(element_id)
      if (panels) {
        let distance = panels.scrollLeft - 320;
        panels.scrollTo({ top: 0, left: distance, behavior: "smooth" });
      }
    }
  }

  scrollRight(element_id: string) {
    if (isPlatformBrowser(this.platformId)) {
      let panels = document.getElementById(element_id)
      if (panels) {
        let distance = panels.scrollLeft + 320;
        panels.scrollTo({ top: 0, left: distance, behavior: "smooth" });
      }
    }
  }
}

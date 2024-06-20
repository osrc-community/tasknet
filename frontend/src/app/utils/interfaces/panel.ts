import {PanelList} from "@utils/interfaces/panel-list";

export interface Panel {
  image: string,
  title: string,
  identifier?: string,
  lists?: PanelList[]
}

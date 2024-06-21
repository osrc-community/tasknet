import {PanelListItem} from "@utils/interfaces/panel-list-item";

export interface PanelList {
  title: string,
  entries: PanelListItem[]
  identifier?: string,
}

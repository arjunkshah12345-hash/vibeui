import type { Demo } from "../demo";
import { actions } from "./actions";
import { craft } from "./craft";
import { data } from "./data";
import { feedback } from "./feedback";
import { footers } from "./footers";
import { forms } from "./forms";
import { hover } from "./hover";
import { navigation } from "./navigation";
import { overlays } from "./overlays";
import { text } from "./text";

/** Every demo, keyed by registry slug. Imported synchronously so previews prerender statically. */
export const demos: Record<string, Demo> = {
  ...actions,
  ...forms,
  ...feedback,
  ...data,
  ...overlays,
  ...navigation,
  ...craft,
  ...text,
  ...hover,
  ...footers,
};

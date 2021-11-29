import React from "react";
import messages_en from "./translations/en.json";
import InsureesBatchPage from "./pages/InsureesBatchPage";
import { FormattedMessage } from "@openimis/fe-core";
import { Subscriptions } from "@material-ui/icons";
import { RIGHT_QUERY_BATCHES } from "./constants";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "core.Router": [{ path: "insuree/batches", component: InsureesBatchPage }],
  "refs": [{ key: "insuree_batch.batches", ref: "insuree/batches" }],
  "insuree.MainMenu": [
    {
      text: <FormattedMessage module="insuree_batch" id="menu.batches" />,
      icon: <Subscriptions />,
      route: "/insuree/batches",
      filter: (rights) => rights.includes(RIGHT_QUERY_BATCHES),
    },
  ],
};

export const InsureeBatchModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...((cfg && cfg["fe-insuree_batch"]) || {}) };
};

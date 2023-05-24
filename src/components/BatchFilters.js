import React from "react";
import {
  ControlledField,
  PublishedComponent,
  TextInput,
  useTranslations,
  decodeId,
  useModulesManager,
  useDebounceCb,
} from "@openimis/fe-core";
import { FormControlLabel, Grid, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  form: {
    padding: "0 0 10px 0",
    width: "100%",
  },
  item: {
    padding: theme.spacing(1),
  },
}));

const BatchFilters = (props) => {
  const { filters, onChangeFilters } = props;
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations("insuree_batch", modulesManager);

  const onValueChange = (id, value) => {
    onChangeFilters([{ id, value }]);
  };

  const onChangeDebounce = useDebounceCb(onValueChange, modulesManager.getConf("fe-admin", "debounceTime", 500));

  return (
    <section className={classes.form}>
      <Grid container>
        <ControlledField
          module="insuree_batch"
          id="BatchFilters.runDate"
          field={
            <Grid item>
              <Grid container>
                <Grid item className={classes.item}>
                  <PublishedComponent
                    pubRef="core.DatePicker"
                    value={filters?.fromRunDate?.value}
                    module="insuree_batch"
                    label="insuree_batch.BatchFilters.fromRunDate"
                    onChange={(value) =>
                      onChangeFilters([
                        {
                          id: "fromRunDate",
                          value: value ? `${value}T00:00:00` : null,
                        },
                      ])
                    }
                  />
                </Grid>
                <Grid item className={classes.item}>
                  <PublishedComponent
                    pubRef="core.DatePicker"
                    value={filters?.toRunDate?.value}
                    module="insuree_batch"
                    label="insuree_batch.BatchFilters.toRunDate"
                    minDate={filters?.fromRunDate?.value}
                    onChange={(value) =>
                      onChangeFilters([
                        {
                          id: "toRunDate",
                          value: value ? `${value}T00:00:00` : null,
                        },
                      ])
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          }
        />

        <ControlledField
          module="insuree_batch"
          id="region"
          field={
            <Grid item xs={4} className={classes.item}>
              <PublishedComponent
                pubRef="location.RegionPicker"
                value={filters.location?.value?.parent ?? filters.location?.value}
                withNull={true}
                onChange={(value) =>
                  onChangeFilters([{ id: "location", value: value, filter: value ? decodeId(value.id) : null }])
                }
              />
            </Grid>
          }
        />
        <ControlledField
          module="insuree_batch"
          id="district"
          field={
            <Grid item xs={4} className={classes.item}>
              <PublishedComponent
                pubRef="location.DistrictPicker"
                value={filters.location?.value?.parent ? filters.location?.value : null}
                region={filters.location?.value?.parent ? filters.location?.value?.parent : filters.location?.value}
                key={filters.location?.value?.parent}
                withNull={true}
                onChange={(value) => {
                  if (!value) {
                    value = filters.location?.value?.parent;
                  }
                  onChangeFilters([{ id: "location", value: value, filter: value ? decodeId(value.id) : null }]);
                }}
              />
            </Grid>
          }
        />
      </Grid>
    </section>
  );
};

export default BatchFilters;

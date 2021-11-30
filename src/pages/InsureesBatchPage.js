import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { useTranslations, useModulesManager, withTooltip } from "@openimis/fe-core";
import { useSelector } from "react-redux";
import BatchSearcher from "../components/BatchSearcher";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CreateBatchDialog from "../components/CreateBatchDialog";
import { RIGHT_CREATE_BATCHES } from "../constants";

const useStyles = makeStyles((theme) => ({ page: theme.page, fab: theme.fab }));

const InsureesBatchPage = (props) => {
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("insuree_batch", modulesManager);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const classes = useStyles();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [resetKey, setResetKey] = useState(null);

  const onDialogClose = () => {
    setResetKey(Date.now());
    setDialogOpen(false);
  };

  return (
    <>
      <CreateBatchDialog open={isDialogOpen} onClose={onDialogClose} key={resetKey} />
      <div className={classes.page}>
        <BatchSearcher key={resetKey} />
        {rights.includes(RIGHT_CREATE_BATCHES) &&
          withTooltip(
            <div className={classes.fab}>
              <Fab color="primary" onClick={() => setDialogOpen(!isDialogOpen)}>
                <AddIcon />
              </Fab>
            </div>,
            formatMessage("InsureesBatchPage.addNewBatch"),
          )}
      </div>
    </>
  );
};

export default InsureesBatchPage;

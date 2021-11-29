import React, { useState } from "react";
import { Box, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useTranslations, useModulesManager, historyPush, withTooltip, withHistory } from "@openimis/fe-core";
import { useSelector } from "react-redux";
import BatchSearcher from "../components/BatchSearcher";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CreateBatchDialog from "../components/CreateBatchDialog";
import { RIGHT_CREATE_BATCHES, RIGHT_QUERY_BATCHES } from "../constants";

const useStyles = makeStyles((theme) => ({ page: theme.page, fab: theme.fab }));

const InsureesBatchPage = (props) => {
  const { history } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("insuree_batch", modulesManager);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const classes = useStyles();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [resetDialogKey, setDialogKey] = useState(null);

  const onDialogClose = () => {
    setDialogKey(Date.now());
    setDialogOpen(false);
  };

  return (
    <>
      <CreateBatchDialog open={isDialogOpen} onClose={onDialogClose} key={resetDialogKey} />
      <div className={classes.page}>
        <BatchSearcher />
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

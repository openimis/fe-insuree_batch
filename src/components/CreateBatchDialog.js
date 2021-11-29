import React, { useState, useMemo } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContentText, DialogActions, DialogContent } from "@material-ui/core";
import {
  useTranslations,
  useModulesManager,
  PublishedComponent,
  TextAreaInput,
  NumberInput,
  ProgressOrError,
  decodeId,
} from "@openimis/fe-core";
import { useCreateBatchMutation } from "../hooks";

const CreateBatchDialog = (props) => {
  const { onClose, open } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("insuree_batch", modulesManager);
  const [values, setValues] = useState({});
  const { error, mutate, isLoading } = useCreateBatchMutation();

  const onSubmit = async () => {
    await mutate({
      amount: values.amount,
      location: values.location ? decodeId(values.location.id) : null,
      comment: values.comment,
    });
    setValues({});
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{formatMessage("CreateBatchDialog.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{formatMessage("CreateBatchDialog.explanation")}</DialogContentText>
        <ProgressOrError error={error} progress={isLoading} />
        {!isLoading && (
          <>
            <Box my={2}>
              <NumberInput
                module="insuree_batch"
                label="batch.amount"
                fullWidth
                required
                value={values.amount}
                onChange={(amount) => setValues({ ...values, amount })}
              />
            </Box>
            <Box my={2}>
              <PublishedComponent
                pubRef="location.RegionPicker"
                value={values.location?.parent ?? values.location}
                withNull={true}
                fullWidth
                onChange={(value) => setValues({ ...values, location: value })}
              />
            </Box>
            <Box my={2}>
              <PublishedComponent
                pubRef="location.DistrictPicker"
                value={values.location?.parent ? values.location : null}
                fullWidth
                region={values.location?.parent ? values.location?.parent : values.location}
                key={values.location?.parent}
                withNull={true}
                onChange={(value) => setValues({ ...values, location: value })}
              />
            </Box>
            <Box my={2}>
              <TextAreaInput
                module="insuree_batch"
                label="batch.comment"
                fullWidth
                value={values.comment}
                onChange={(comment) => setValues({ ...values, comment })}
              />
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{formatMessage("CreateBatchDialog.cancel")}</Button>
        <Button disabled={isLoading && values.amount} onClick={onSubmit} color="primary">
          {formatMessage("CreateBatchDialog.submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBatchDialog;

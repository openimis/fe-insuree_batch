import React, { useState, useEffect } from "react";
import {
  Box,
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { useTranslations, useModulesManager, NumberInput, decodeId, baseApiUrl } from "@openimis/fe-core";

const ExportInsureesDialog = (props) => {
  const { onClose, open, batch } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("insuree_batch", modulesManager);
  const [values, setValues] = useState({ dryRun: true });

  const onSubmit = async () => {
    window.open(
      `${baseApiUrl}/insuree_batch/export_insurees?batch=${decodeId(batch.id)}&dryRun=${values.dryRun}&count=${
        values.count
      }`,
    );
    onClose();
    setValues({ dryRun: true });
  };

  useEffect(() => {
    if (open) {
      setValues({ ...values, count: batch.nbGenerated - batch.nbPrinted || 0 });
    }
  }, [open]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{formatMessage("ExportInsureesDialog.title")}</DialogTitle>
      <DialogContent>
        <Box my={2}>
          <NumberInput
            module="insuree_batch"
            label="export.count"
            fullWidth
            required
            value={values.count}
            onChange={(count) => setValues({ ...values, count })}
          />
        </Box>
        <Box my={2}>{formatMessage("ExportInsureesDialog.dryRunExplanation")}</Box>
        <Box my={2}>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={values.dryRun}
                onChange={() => setValues({ ...values, dryRun: !values.dryRun })}
              />
            }
            label={formatMessage("export.dryRun")}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{formatMessage("ExportInsureesDialog.cancel")}</Button>
        <Button disabled={!values.count} onClick={onSubmit} color="primary">
          {formatMessage("ExportInsureesDialog.export")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportInsureesDialog;

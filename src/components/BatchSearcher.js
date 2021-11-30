import React, { useState, useCallback } from "react";
import { useTranslations, useModulesManager, Searcher, PublishedComponent } from "@openimis/fe-core";
import { Tooltip, Box, IconButton } from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import { useBatchesQuery } from "../hooks";
import BatchFilters from "./BatchFilters";
import GetAppIcon from "@material-ui/icons/GetApp";
import ExportInsureesDialog from "./ExportInsureesDialog";

const BatchSearcher = (props) => {
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues, formatDateFromISO } = useTranslations(
    "insuree_batch",
    modulesManager,
  );
  const [batchToExport, setBatchToExport] = useState();
  const [resetKey, setResetKey] = useState();
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useBatchesQuery({ filters }, { skip: true, keepStale: true });

  const onPrint = (batch) => {
    window.open(batch.printUrl, "_blank");
  };

  const filtersToQueryParam = useCallback((state) => {
    const params = {
      first: state.pageSize,
      after: state.afterCursor,
      before: state.beforeCursor,
    };
    Object.entries(state.filters).forEach(([filterKey, filter]) => {
      params[filterKey] = filter.filter ?? filter.value;
    });
    return params;
  }, []);

  const getHeaders = useCallback(
    () => [
      "insuree_batch.batch.runDate",
      "insuree_batch.batch.location",
      "insuree_batch.batch.comment",
      "insuree_batch.batch.nbGenerated",
      "insuree_batch.batch.nbPrinted",
      "",
    ],
    [],
  );

  const itemFormatters = useCallback(
    () => [
      (b) => formatDateFromISO(b.runDate),
      (b) => (
        <Box minWidth={200}>
          <PublishedComponent pubRef="location.LocationPicker" withLabel={false} value={b.location} readOnly />
        </Box>
      ),
      (b) => b.comment,
      (b) => b.nbGenerated,
      (b) => b.nbPrinted,
      (b) => (
        <>
          <Tooltip title={formatMessage("BatchSearcher.printActionButton")}>
            <IconButton size="small" onClick={() => onPrint(b)}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={formatMessage("BatchSearcher.exportActionButton")}>
            <IconButton size="small" onClick={() => setBatchToExport(b)}>
              <GetAppIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    ],

    [],
  );

  const getAligns = useCallback(() => [null, null, null, null, null, "right"], []);
  const onDialogClose = () => {
    setBatchToExport(null);
    setResetKey(Date.now());
  };

  return (
    <>
      <ExportInsureesDialog
        open={Boolean(batchToExport)}
        key={resetKey}
        batch={batchToExport}
        onClose={onDialogClose}
      />
      <Searcher
        key={resetKey}
        module="insuree_batch"
        tableTitle={formatMessageWithValues("BatchSearcher.tableTitle", { count: data?.pageInfo?.totalCount ?? 0 })}
        fetch={setFilters}
        FilterPane={BatchFilters}
        headers={getHeaders}
        aligns={getAligns}
        items={data?.batches}
        errorItems={error}
        fetchingItems={isLoading}
        itemsPageInfo={data?.pageInfo}
        rowIdentifier={(r) => r.id}
        filtersToQueryParams={filtersToQueryParam}
        itemFormatters={itemFormatters}
      />
    </>
  );
};

export default BatchSearcher;

import React, { useState, useCallback, useEffect } from "react";
import {
  useTranslations,
  useModulesManager,
  historyPush,
  withTooltip,
  withHistory,
  formatMessageWithValues,
  Searcher,
} from "@openimis/fe-core";
import { useBatchesQuery } from "../hooks";
import BatchFilters from "./BatchFilters";

const BatchSearcher = (props) => {
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues, formatDateFromISO } = useTranslations(
    "insuree_batch",
    modulesManager,
  );
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useBatchesQuery({ filters }, { skip: true, keepStale: true });

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
    () => ["insuree_batch.batch.runDate", "insuree_batch.batch.comment", "insuree_batch.batch.totalCount"],
    [],
  );
  const itemFormatters = useCallback(
    () => [(b) => formatDateFromISO(b.runDate), (b) => b.comment, (b) => b.insureeNumbers.totalCount],
    [],
  );
  return (
    <Searcher
      module="insuree_batch"
      tableTitle={formatMessageWithValues("BatchSearcher.tableTitle", { count: data?.pageInfo?.totalCount ?? 0 })}
      fetch={setFilters}
      FilterPane={BatchFilters}
      headers={getHeaders}
      items={data?.batches}
      errorItems={error}
      fetchingItems={isLoading}
      itemsPageInfo={data?.pageInfo}
      rowIdentifier={(r) => r.id}
      filtersToQueryParams={filtersToQueryParam}
      itemFormatters={itemFormatters}
    />
  );
};

export default BatchSearcher;

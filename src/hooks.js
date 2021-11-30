import { useMemo } from "react";
import { useGraphqlMutation, useGraphqlQuery } from "@openimis/fe-core";
import _ from "lodash";

export const useBatchesQuery = ({ filters }, config) => {
  const { isLoading, error, data, refetch } = useGraphqlQuery(
    `
    query useBatchesQuery ($first: Int, $last: Int, $before: String, $after: String, $fromRunDate: DateTime, $toRunDate: DateTime, $location: String) {
      batches: insureeBatches(first: $first, last: $last, before: $before, after: $after, runDate_Lte: $toRunDate, runDate_Gte: $fromRunDate, location_Uuid: $location) {
        edges {
          node {
            id
            runDate
            archived
            comment
            printUrl
            location {
              id code name uuid parent {id uuid code name}
            }
            nbGenerated
            nbPrinted
          }
        }
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
      }
    }
  
  `,
    filters,
    config,
  );

  const batches = useMemo(() => (data ? _.map(data.batches?.edges, "node") : []), [data]);
  const pageInfo = useMemo(
    () => (data ? Object.assign({ totalCount: data.batches?.totalCount }, data.batches?.pageInfo) : {}),
    [data],
  );
  return { isLoading, error, data: { batches, pageInfo }, refetch };
};

export const useCreateBatchMutation = () => {
  const mutation = useGraphqlMutation(
    `
    mutation useCreateInsureeBatchMutation($input: CreateInsureeBatchMutationInput!) {
      createInsureeBatch(input: $input) {
        internalId
        clientMutationId
      }
    }
  `,
    { onSuccess: (data) => data?.createInsureeBatch },
  );

  return mutation;
};

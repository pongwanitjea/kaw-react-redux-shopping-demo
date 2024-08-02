import { useFetchStockQuery } from "./stockSlice";
import { useFetchStoreQuery } from "./storeSlice";



export const useCombinedStockStoreQuery = ({ storeId }: { storeId: string; }) => {

  const stockQuery = useFetchStockQuery({ storeId });
  const storeQuery = useFetchStoreQuery({ storeId });

  return {
    data: {
      stockData: stockQuery.data,
      storeData: storeQuery.data,
    },
    isLoading: stockQuery.isLoading || storeQuery.isLoading,
    isError: stockQuery.isError || storeQuery.isError,
    error: stockQuery.error || storeQuery.error,
  };
};

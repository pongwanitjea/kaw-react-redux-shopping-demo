import { useState, useEffect } from 'react';
import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import { LoaderComponent } from '../components/loaderComponent';
import { useAppSelector } from '../store/hooks';
import { Typography } from '@material-tailwind/react';
import { hocLoader } from '../components/hocLoader';
import { useCombinedStockStoreQuery } from '../slices/combinedQueries';
import { AddProduct } from '../components/product/addProduct';
import { EditProduct } from '../components/product/editProduct';
import { useFetchStockQuery } from '../slices/stockSlice';
import { Store, useFetchStoreQuery } from '../slices/storeSlice';
import { selectActiveSession } from '../slices/userSlice';
import { beforeLoadRouteGuardStoreOwnerCheck } from '../util/beforeLoadRouteGuard';

export const Route = createFileRoute('/store/manage/product')({
  beforeLoad: beforeLoadRouteGuardStoreOwnerCheck,
  component: StoreManageProduct
});

export function StoreManageProduct() {
  const activeSession = useAppSelector(selectActiveSession);

  const WrappedComponent = hocLoader(
    () => useFetchStoreQuery({ storeId: activeSession?.storeOwner! }),
    'FULL_PAGE_SPINNER',
    ({data}: {data: Store}) => {
      const { data: dataStock, isError, error, isLoading, refetch } = useFetchStockQuery({ storeId: activeSession.storeOwner! });
      const [refetchTrigger, setRefetchTrigger] = useState(false);


      useEffect(() => {
        if (refetchTrigger) {
          refetch();
          setRefetchTrigger(false);
        }
      }, [refetchTrigger, refetch]);
    
      
      return (
        <div className="common-container-margin">
          <Typography variant="h1">Manage Store {data?.name} Product and Stock</Typography>
          <div className="common-product-container mt-8 mb-8">
            {dataStock?.map(stock => {
              return (<EditProduct stock={stock} key={stock.productId} />);
            })}
          </div>
          <div>
    
          </div>
          <AddProduct onProductAdded={() => setRefetchTrigger(true)} />
    
        </div>
      );
    });
    return <WrappedComponent/>;

}
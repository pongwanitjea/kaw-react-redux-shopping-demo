import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import { Typography } from '@material-tailwind/react';
import { useAppSelector } from '../store/hooks';
import { ProductCard } from '../components/product/productCard';
import { useCombinedStockStoreQuery } from '../slices/combinedQueries';
import { hocLoader } from '../components/hocLoader';
import { selectActiveSession } from '../slices/userSlice';
import { Store } from '../slices/storeSlice';
import { CheckOutButton } from '../components/cart/checkOutButton';
import { Stock } from '../slices/stockSlice';

export const Route = createLazyFileRoute('/store/$storeId')({
  component: StorePage
});


function StorePage() {
  const { storeId } = useParams({
    from: '/store/$storeId'
  });
  const WrappedStorePage = hocLoader(
    () => useCombinedStockStoreQuery({ storeId }),
    'FULL_PAGE_SPINNER',
    ({data}: {data: {stockData: Stock[], storeData: Store}}) => {
      const activeSession = useAppSelector(selectActiveSession);
      const { stockData, storeData } = data;
      return (
        <div className="common-container-margin flex flex-col justify-center">
          <Typography variant="h3" className="mb-4">{storeData?.name}</Typography>
          <Typography variant="h6" className="mb-4">{storeData?.description}</Typography>
    
          <div className="common-product-container">
            {stockData?.map((item) => {
              return(
              <ProductCard key={item.productId} storeId={storeId} item={item} />
            )})}
          </div>
          <footer className="common-fixed-footer">
            {activeSession.user ? <CheckOutButton storeId={storeId}/> : <></>}
          </footer>
          <div className="pb-32"></div>
    
        </div>
      );
    }
  );
  return <WrappedStorePage/>;

}
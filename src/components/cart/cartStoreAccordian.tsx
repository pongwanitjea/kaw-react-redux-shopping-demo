import { Accordion, AccordionHeader, Checkbox, Typography, AccordionBody } from "@material-tailwind/react";
import { useState } from "react";
import { ProductCard } from "../product/productCard";
import { useNavigate } from "@tanstack/react-router";
import { useAppDispatch } from "../../store/hooks";
import { hocLoader } from "../hocLoader";
import { useCombinedStockStoreQuery } from "../../slices/combinedQueries";
import { Store } from "@reduxjs/toolkit";
import { Cart, changeItemSelected } from "../../slices/cartSlice";
import { Stock } from "../../slices/stockSlice";

export function CartStoreAccordianComponent({storeId, cartOfThatStore, data} : {storeId: string, cartOfThatStore: Cart[], data: {stockData: Stock[], storeData: Store}}){
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { stockData, storeData } = data;
    const dataStock = stockData;
    const dataStore = storeData;
    const checked = cartOfThatStore.every(item => item.selected == true);
    const [accordianOpen, setAccordianOpen] = useState(true);

    return (
      <Accordion key={storeId + "|Accordian"} open={accordianOpen}>
        <AccordionHeader key={storeId + "|AccordianHeader"}>
          <div className="flex flex-row justify-start" key={storeId}>
            <Checkbox
              color="blue"
              checked={checked}
              key={storeId}
              onChange={(e) => {
                if (checked) {
                  dispatch(changeItemSelected({
                    storeId: storeId,
                    selected: false,
                  }))
                } else {
                  dispatch(changeItemSelected({
                    storeId: storeId,
                    selected: true,
                  }))
                }
              }}
            />
            <Typography
              variant="h3"
              key={storeId + "|TypographyStoreLink"}
              onClick={() => {
                navigate({ to: "/store/$storeId", params: { storeId: storeId } });
              }}
            >
              {dataStore?.name}
            </Typography>
          </div>
        </AccordionHeader>
        <AccordionBody className="shadow-md" key={storeId + "|AccordionBody"}>
          <div className="common-product-container" key={storeId + "|divCommonProductContainer"}>
            {cartOfThatStore.map(item => {
              const stockOfThatProductOfThatStore = dataStock?.find(stock => stock.productId === item.productId && stock.storeId === item.storeId);

              if (stockOfThatProductOfThatStore && item.selectedAmount > 0) {
                if (stockOfThatProductOfThatStore.stockAmount == 0 && item.selected == true) {
                  dispatch(changeItemSelected({
                    storeId: storeId,
                    productId: item.productId,
                    selected: false,
                  }))
                }
                return (<div className="flex flex-row" key={storeId + "|divCheckboxAndProductCard|" + item.productId}>
                  <Checkbox
                    color="blue"
                    disabled={stockOfThatProductOfThatStore.stockAmount == 0}
                    checked={item.selected}
                    onChange={(e) => {
                       if (item.selected){
                        dispatch(changeItemSelected({
                          storeId: storeId,
                          productId: item.productId,
                          selected: false,
                        }))
                      } else if (!item.selected && stockOfThatProductOfThatStore.stockAmount >= item.selectedAmount){
                        dispatch(changeItemSelected({
                          storeId: storeId,
                          productId: item.productId,
                          selected: true,
                        }))
                      } else {
                        // do nothing
                      }
                    }}
                    key={storeId + "|" + item.productId + "|Checkbox"}
                  >
                  </Checkbox>
                  <ProductCard key={storeId + "|" + item.productId + "|ProductCard"} storeId={storeId} item={stockOfThatProductOfThatStore} />
                </div>);
              }
            })}
          </div>
        </AccordionBody>
      </Accordion>
    );
}

export const CartStoreAccordian = hocLoader(
    ({ storeId }: {storeId: string}) => useCombinedStockStoreQuery({ storeId }),
    'CARD_DEFAULT_SKELETON',
    CartStoreAccordianComponent
);
  
  
import { ErrorComponent, Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { APIProvider, AdvancedMarker, ControlPosition, Map, MapControl, Marker, Pin, useMap, useMarkerRef } from '@vis.gl/react-google-maps'
import { useEffect, useMemo, useState } from 'react';
import { LoaderComponent } from '../components/loaderComponent';
import { Card, CardBody, Input, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from '@material-tailwind/react';
import { MapIcon, ListBulletIcon } from '@heroicons/react/24/solid';
import { useFetchStoresQuery } from '../slices/storeSlice';
import { StoreCard } from '../components/store/storeCard';

export const Route = createFileRoute('/home')({
  component: Home,
})

function Home() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const queryParameters = useMemo(() => ({ page: 1, limit: 100 }), []);
  const {
    isLoading,
    isFetching,
    isError,
    error,
    data,
  } = useFetchStoresQuery(queryParameters);

  if (isLoading || isFetching) {
    return <LoaderComponent />;
  }

  if (isError) {
    return <ErrorComponent error={error} />;
  }

  const filteredStores = data?.stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="common-container-margin">
      <div className="flex justify-center">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full flex">
          <button
            className={`list-map-button-switch ${activeTab === "list" ? "bg-white dark:bg-gray-800 shadow-md" : ""
              }`}
            onClick={() => setActiveTab("list")}
          >
            <ListBulletIcon className="h-6 w-6 inline-block mr-2" />
            List View
          </button>
          <button
            className={`list-map-button-switch ${activeTab === "map" ? "bg-white dark:bg-gray-800 shadow-md" : ""
              }`}
            onClick={() => setActiveTab("map")}
          >
            <MapIcon className="h-6 w-6 inline-block mr-2" />
            Map View
          </button>
        </div>
      </div>
      <div className="mt-4">
        {activeTab === "map" ? (
          <APIProvider apiKey={apiKey}>
            <Map
              style={{ width: '100%', height: '70vh' }}
              zoom={15}
              center={{ lat: 53.54992, lng: 10.00678 }}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
              mapId='main_map_id'
            >
              {data?.stores.map((store) => (
                <AdvancedMarker
                  key={store.id}
                  position={{ lat: store.lat, lng: store.long }}
                  onClick={() => {
                    navigate({ to: '/store/$storeId', params: { storeId: store.id } })
                  }}
                >
                  <div className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 max-w-xs cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={store.imageUrl || 'path/to/fallback-image.jpg'}
                          alt={store.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-semibold text-gray-800 truncate">{store.name}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
                      </div>
                    </div>
                  </div>
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        ) : (
          <div className="flex flex-col items-center mx-auto list-view-sizing">
            <div className="mb-4 list-view-sizing">
              <Input
                type="text"
                label="Search stores" //TODO Search stores and products...
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              {filteredStores?.map((store) => (
                <Link
                  to="/store/$storeId"
                  params={{ storeId: store.id }}
                  className="block"
                  key={store.id}
                >
                  <StoreCard store={store}/>
                </Link>
              ))}
          </div>
          </div>
        )}
    </div>
    </div >
  );

}
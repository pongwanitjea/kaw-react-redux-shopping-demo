import { LoaderComponent } from './loaderComponent';
import { ErrorComponent } from './errorComponent';
import { Card, Typography } from '@material-tailwind/react';

export const hocLoader = (useFetchQuery: any, loaderMode: 'FULL_PAGE_SPINNER' | 'CARD_DEFAULT_SKELETON' | 'DEFAULT_SKELETON'| 'ONE_LINE_SKELETON', WrappedComponent: any) => {
    return (props) => {
        const { data, isLoading, isError, error } = useFetchQuery(props);

        if (isLoading) {
            switch (loaderMode) {
                case 'CARD_DEFAULT_SKELETON':
                    return (<Card className="m-1 pt-2 pb-2 pl-2 pr-2">
                        <DefaultSkeleton/>
                    </Card>);
                case 'DEFAULT_SKELETON':
                    return <DefaultSkeleton />;
                case 'FULL_PAGE_SPINNER':
                    return <LoaderComponent />;
                case 'ONE_LINE_SKELETON':
                    return <OneLineSkeleton />;
            }

        }

        if (isError) {
            return <ErrorComponent error={error} />;
        }

        if (!data) {
            return <>Error, data not found but not error</>;
        }

        return <WrappedComponent data={data} {...props} />;
    };
};


function DefaultSkeleton() {
    return (
        <div className="max-w-full animate-pulse">
            <Typography
                as="div"
                variant="h1"
                className="mb-4 h-3 w-56 rounded-full bg-gray-300"
            >
                &nbsp;
            </Typography>
            <Typography
                as="div"
                variant="paragraph"
                className="mb-2 h-2 w-72 rounded-full bg-gray-300"
            >
                &nbsp;
            </Typography>
            <Typography
                as="div"
                variant="paragraph"
                className="mb-2 h-2 w-72 rounded-full bg-gray-300"
            >
                &nbsp;
            </Typography>
            <Typography
                as="div"
                variant="paragraph"
                className="mb-2 h-2 w-72 rounded-full bg-gray-300"
            >
                &nbsp;
            </Typography>
            <Typography
                as="div"
                variant="paragraph"
                className="mb-2 h-2 w-72 rounded-full bg-gray-300"
            >
                &nbsp;
            </Typography>
        </div>
    );
}

function OneLineSkeleton() {
    return (<div className="max-w-full animate-pulse">
        <Typography
            as="div"
            variant="paragraph"
            className="mb-2 h-2 w-72 rounded-full bg-gray-300"
        >
            &nbsp;
        </Typography>
    </div>);
}
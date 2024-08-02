import { ErrorComponent, Link, createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { Button, Card, CardBody, Input, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from '@material-tailwind/react';
import { useAppDispatch } from '../store/hooks';
import { DemoActiveSessions, login } from '../slices/userSlice';

export const Route = createFileRoute('/login/$redirect')({
  component: Index,
})


function Index() {
  const { redirect } = useParams({
    from: '/login/$redirect',
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();


  return (
    <div className="common-container-margin max-w-3xl mx-auto">
      <Card className="hover:shadow-lg transition-shadow duration-300 mb-4">
        <CardBody>
          <Typography variant="h2" color="blue-gray" className="mb-4">
            Welcome to Pongwanit's React Skill Showcase
          </Typography>
          <Typography variant="paragraph" className="mb-6">
            Select a user to login. <br /><br />Please note that this is just a demo and learning project. Currently, it does not have a backend but uses a mocked backend running in the browser using mswjs, and it lacks proper user authentication.
            <br />It has data persistence by using browser localStorage.
            <br /><br />Highlight libraries that drives this project:<br /><br />
            <ul>
              <li>@material-tailwind/react ^2.1.9</li>
              <li>@reduxjs/toolkit ^2.2.0</li>
              <li>react-redux ^9.1.0</li>
              <li>@tanstack/react-router ^1.43.6</li>
              <li>react-hook-form ^7.52.1</li>
              <li>@vite ^5.3.2</li>
              <li>msw ^2.3.1</li>
            </ul>
            <br/><br/>Until real backend is implemented, please be aware that if this website is left idle, it might error when call API due to service worker of mswjs is restarted by Chromium engine: <a href='https://github.com/mswjs/msw/issues/2115' target='_blank'>https://github.com/mswjs/msw/issues/2115</a>
            <br/><br/>Due to rush to get this site up and running. This site is being constantly updated. Adding new features, handle error scenarios, code being refactored, performance being optimized.
            <br/><br/>30 July 2024 - Added Store view order, add and manage product, edit store
            <br/><br/>2 Aug 2024 - Code cleaned, use HOC concept to wrap component with RTK Queries and loader. Global error dialog implemented. Source code now available at <a href='https://bit.ly/3LPdDzy' target='_blank'>https://bit.ly/3LPdDzy</a>

          </Typography>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card key={"GuestCard"} className="hover:shadow-lg transition-shadow duration-300">
          <CardBody className="flex flex-col items-center">
            <Typography variant="h5" color="blue-gray" className="mb-2">
              Guest Mode
            </Typography>
            <Button
              color="blue"
              ripple={true}
              className="w-full"
              onClick={() => {
                navigate({ to: "/home" })
              }}
            >
              Enter without login
            </Button>
          </CardBody>
        </Card>
        {DemoActiveSessions.map(demoActiveSession => (
          <Card key={demoActiveSession.user + "Card"} className="hover:shadow-lg transition-shadow duration-300">
            <CardBody className="flex flex-col items-center">
              <Typography variant="h5" color="blue-gray" className="mb-2">
                {demoActiveSession.name}
              </Typography>
              {demoActiveSession.storeOwner && (
                <Typography variant="small" color="gray" className="mb-4">
                  Store owner: {demoActiveSession.storeOwner}
                </Typography>
              )}
              <Button
                color="blue"
                ripple={true}
                className="w-full"
                onClick={() => {
                  dispatch(login(demoActiveSession))
                  if (redirect.length > 0 && redirect != "undefined") {
                    navigate({ to: redirect })
                  } else {
                    navigate({ to: "/home" })
                  }
                }}
              >
                Login as {demoActiveSession.user}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          color="red"
          variant="outlined"
          ripple={true}
          onClick={() => {
            localStorage.clear()
            location.reload()
          }}
        >
          Reset Demo Data
        </Button>
      </div>
    </div>
  )

}
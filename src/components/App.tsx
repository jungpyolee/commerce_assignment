import { RecoilRootPortal } from '@components/RecoilRootPortal';
import Views from '@components/Views';
import { IS_PRODUCTION } from '@config';
import capacitorApp from '@js/capacitor-app';
import { getDevice } from '@js/framework7-custom';
import { toast } from '@js/utils';
import routes from '@routes';
import { Auth } from 'aws-amplify';
import { App, f7ready } from 'framework7-react';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { RecoilRoot } from 'recoil';

Auth.configure({
  aws_project_region: 'ap-northeast-2',
  aws_cognito_region: 'ap-northeast-2',
  aws_user_pools_web_client_id: '7p64rveq2l3fhk9h47mt80vo9u',
  aws_user_pools_id: 'ap-northeast-2_4ktiDw5Su',
  aws_cognito_identity_pool_id: 'ap-northeast-2:e88bd1dc-a15d-4e6a-bd56-715d10772d67',
});

const F7App = () => {
  const device = getDevice();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: IS_PRODUCTION,
        refetchOnReconnect: IS_PRODUCTION,
      },
    },
  });

  const f7params = {
    name: 'GUZEGUZE',
    theme: 'ios',
    id: 'com.insomenia.practice',
    routes,
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
    view: {
      iosDynamicNavbar: device.ios,
    },
  };

  useEffect(() => {
    f7ready((f7) => {
      if (f7.device.capacitor) {
        capacitorApp.init(f7);
      }
      toast.set(f7);
    });
  }, []);

  if (!IS_PRODUCTION) console.log(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <App {...f7params}>
          <Views />
        </App>
        {/* {IS_PRODUCTION ? null : <ReactQueryDevtools position="bottom-right" />} */}
        <RecoilRootPortal />
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default F7App;

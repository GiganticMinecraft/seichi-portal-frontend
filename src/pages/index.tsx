import { Home } from '@/components/pages/home';
import { MS_APP_REDIRECT_URL } from '@/const/env';

const Component = () => {
  console.log(MS_APP_REDIRECT_URL);

  return <Home />;
};

export default Component;

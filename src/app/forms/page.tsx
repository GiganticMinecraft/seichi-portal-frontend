import { getForms } from '@/features/form/api/form';
import FormList from '@/features/form/components/FormList';
import { getCachedToken } from '@/features/user/api/mcToken';

const Home = async () => {
  const token = getCachedToken() ?? '';
  const forms = await getForms(token);
  return <FormList forms={forms} />;
};

export default Home;

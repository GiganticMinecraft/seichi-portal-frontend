import { getForms } from '@/api/form';
import { getCachedToken } from '@/api/mcToken';
import FormList from '@/components/FormList';

const Home = async () => {
  const token = getCachedToken() ?? '';
  const forms = await getForms(token);
  return <FormList forms={forms} />;
};

export default Home;

import { getForms } from '@/api/form';
import { getCachedToken } from '@/api/mcToken';
import FormList from '@/components/FormList';

export default async function Home() {
  const token = getCachedToken() ?? '';
  const forms = await getForms(token);
  return <FormList forms={forms} />;
}

import { getForms } from '@/api/form';
import FormList from '@/components/FormList';

export default async function Home() {
  const forms = await getForms();
  return <FormList forms={forms} />;
}

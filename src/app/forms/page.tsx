import { getForms } from '@/api/form';
import Forms from '@/components/forms';

export default async function Home() {
  const forms = await getForms();
  return <Forms forms={forms} />;
}

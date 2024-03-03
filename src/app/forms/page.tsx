import { isRight } from 'fp-ts/lib/Either';
import { getForms } from '@/features/form/api/form';
import FormList from '@/features/form/components/FormList';
import { getCachedToken } from '@/features/user/api/mcToken';
import { redirectOrDoNothing } from '../error/RedirectByErrorResponse';

const Home = async () => {
  const token = (await getCachedToken()) ?? '';
  const forms = await getForms(token);

  if (isRight(forms)) {
    return <FormList forms={forms.right} />;
  } else {
    redirectOrDoNothing(forms);
    return <></>;
  }
};

export default Home;

import { Box, Alert, AlertTitle } from '@mui/material';
import { isErr, unwrapOk } from 'option-t/esm/PlainResult';
import { getForms } from '@/features/form/api/form';
import FormList from '@/features/form/components/FormList';
import { getCachedToken } from '@/features/user/api/mcToken';

const Home = async () => {
  const token = getCachedToken() ?? '';
  const forms = await getForms(token);
  if (isErr(forms)) {
    return (
      <Box sx={{ width: '100%' }}>
        <Alert severity="error">
          <AlertTitle>フォーム一覧を取得できませんでした</AlertTitle>
        </Alert>
      </Box>
    );
  }

  return <FormList forms={unwrapOk(forms)} />;
};

export default Home;

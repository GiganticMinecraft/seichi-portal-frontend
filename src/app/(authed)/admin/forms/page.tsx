'use client';

import { Add } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
import { redirect } from 'next/navigation';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import { Forms } from './_components/DashboardFormList';
import type { MinimumForm } from '@/_schemas/formSchema';
import type { ErrorResponse } from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = () => {
  const { data: forms, isLoading } =
    useSWR<Either<ErrorResponse, MinimumForm[]>>('/api/forms');

  if (!isLoading && !forms) {
    redirect('/');
  } else if (!forms) {
    return null;
  }

  if (forms._tag === 'Left') {
    return <ErrorModal />;
  }

  return (
    <Stack spacing={2}>
      <Grid container sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Autocomplete
            multiple
            id="filter-forms"
            options={['Open', 'Closed']}
            getOptionLabel={(option) => option}
            defaultValue={['Open']}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  label={option}
                  sx={{ background: '#FFFFFF29' }}
                  {...getTagProps({ index })}
                  key={index}
                />
              ))
            }
            renderOption={(props, option) => {
              return (
                <Box component="span" {...props} style={{ color: 'black' }}>
                  {option}
                </Box>
              );
            }}
            renderInput={(params) => (
              // @ts-expect-error (解決方法がよくわからないのでとりあえずignoreする)
              // FIXME: あとで調べる
              <TextField
                {...params}
                variant="standard"
                label="Filter"
                sx={{ borderBottom: '1px solid #FFFFFF6B' }}
                InputLabelProps={{ style: { color: '#FFFFFF80' } }}
              />
            )}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<Add />}
            href="/admin/forms/create"
            sx={{
              width: '97px',
              height: '36px',
              boxShadow:
                '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12)',
              borderRadius: '64px',
            }}
          >
            NEW
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item>
          <Forms forms={forms.right} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Home;

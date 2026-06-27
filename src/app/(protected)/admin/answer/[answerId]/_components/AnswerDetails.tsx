'use client';

import { Label, Send } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAnswerActions } from '@/hooks/useAnswerActions';
import type {
  GetAnswerLabelsResponse,
  GetAnswerResponse,
} from '@/lib/api-types';

export const AdminAnswerTitle = (props: { answer: GetAnswerResponse }) => {
  const { handleSubmit, register } = useForm<{ title: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(props.answer.title);
  const { updateTitle } = useAnswerActions(
    props.answer.form_id,
    props.answer.id
  );

  const onSubmit = async (data: { title: string }) => {
    const result = await updateTitle(data.title);
    if (result.ok) {
      setIsEditing(false);
      setTitle(data.title);
    }
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      {isEditing ? (
        <TextField
          {...register('title')}
          defaultValue={title}
          required
          sx={{ minWidth: 280, flexGrow: 1 }}
        />
      ) : (
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
      )}
      {isEditing ? (
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={handleSubmit(onSubmit)}
        >
          編集完了
        </Button>
      ) : (
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => setIsEditing(true)}
        >
          タイトルを編集
        </Button>
      )}
    </Stack>
  );
};

export const AdminAnswerLabels = (props: {
  labelOptions: GetAnswerLabelsResponse;
  answer: GetAnswerResponse;
}) => {
  const { updateLabels } = useAnswerActions(
    props.answer.form_id,
    props.answer.id
  );

  return (
    <Autocomplete
      multiple
      id="label"
      options={props.labelOptions.map((label) => label.name)}
      getOptionLabel={(option) => option}
      defaultValue={props.answer.labels.map((label) => label.name)}
      renderOption={(renderProps, option) => (
        <Box {...renderProps} key={option} component="span">
          {option}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        />
      )}
      onChange={async (_event, value) => {
        const selectedIds = props.labelOptions
          .filter((label) => value.includes(label.name))
          .map((label) => label.id);
        await updateLabels(selectedIds);
      }}
    />
  );
};

export const AdminAnswerLabelManagementButton = () => (
  <Button
    component={NextLink}
    variant="contained"
    href="/admin/labels?tab=answers"
    startIcon={<Label />}
  >
    ラベルの管理
  </Button>
);

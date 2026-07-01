'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useController } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import type { GetUserGroupsResponse } from '@/lib/api-types';

import type { FormEditorValues } from '../_schema/formEditorSchema';

const FormGroupField = (props: {
  control: Control<FormEditorValues>;
  name: 'settings.allowed_group_ids' | 'settings.answer_group_ids';
  label: string;
  helperText: string;
  groupOptions: GetUserGroupsResponse;
}) => {
  const { field } = useController({
    control: props.control,
    name: props.name,
  });

  const selectedGroups = props.groupOptions.filter((group) =>
    field.value.includes(group.id)
  );

  return (
    <Autocomplete
      multiple
      id={props.name}
      options={props.groupOptions}
      getOptionLabel={(option) => option.name}
      value={selectedGroups}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(renderProps, option) => (
        <Box {...renderProps} key={option.id} component="span">
          {option.name}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          helperText={props.helperText}
        />
      )}
      onChange={(_event, value) => {
        field.onChange(value.map((group) => group.id));
      }}
    />
  );
};

export default FormGroupField;

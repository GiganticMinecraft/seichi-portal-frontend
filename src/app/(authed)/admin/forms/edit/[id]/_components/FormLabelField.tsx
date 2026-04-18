'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { useFormLabelActions } from '@/hooks/useFormLabelActions';
import type { GetFormLabelsResponse } from '@/lib/api-types';

const FormLabelField = (props: {
  formId: string;
  labelOptions: GetFormLabelsResponse;
  currentLabels: GetFormLabelsResponse;
}) => {
  const { updateLabels } = useFormLabelActions(props.formId);

  return (
    <Autocomplete
      multiple
      id="label"
      options={props.labelOptions.map((label) => label.name)}
      getOptionLabel={(option) => option}
      defaultValue={props.currentLabels.map((label) => label.name)}
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
      renderOption={(renderProps, option) => (
        <Box
          {...renderProps}
          key={option}
          component="span"
          style={{ color: 'black' }}
        >
          {option}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label="フォームラベル設定"
          sx={{ borderBottom: '1px solid #FFFFFF6B' }}
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

export default FormLabelField;

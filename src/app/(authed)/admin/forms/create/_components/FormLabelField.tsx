import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useController } from 'react-hook-form';
import type { GetFormLabelsResponse } from '@/lib/api-types';
import type { FormEditorValues } from '../../_schema/formEditorSchema';
import type { Control } from 'react-hook-form';

const FormLabelField = (props: {
  control: Control<FormEditorValues>;
  labelOptions: GetFormLabelsResponse;
}) => {
  const { field } = useController({
    control: props.control,
    name: 'labels',
    defaultValue: [],
  });

  return (
    <Autocomplete
      multiple
      id="label"
      options={props.labelOptions}
      getOptionLabel={(option) => option.name}
      value={field.value}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{ chip: { sx: { background: '#FFFFFF29' } } }}
      renderOption={(props, option) => (
        <Box {...props} key={option.id} component="span">
          {option.name}
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
      onChange={(_event, value) => field.onChange(value)}
    />
  );
};

export default FormLabelField;

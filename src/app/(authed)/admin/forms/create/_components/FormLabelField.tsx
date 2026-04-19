import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { useController } from 'react-hook-form';
import type { GetFormLabelsResponse } from '@/lib/api-types';
import type { Control } from 'react-hook-form';
import type { Form } from '../_schema/createFormSchema';

const FormLabelField = (props: {
  control: Control<Form>;
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
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.name}
            sx={{ background: '#FFFFFF29' }}
            {...getTagProps({ index })}
            key={option.id}
          />
        ))
      }
      renderOption={(props, option) => (
        <Box
          {...props}
          key={option.id}
          component="span"
          style={{ color: 'black' }}
        >
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

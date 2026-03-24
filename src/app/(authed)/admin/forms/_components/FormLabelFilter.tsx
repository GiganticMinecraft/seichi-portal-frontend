import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import type { GetFormLabelsResponse } from '@/lib/api-types';
import type { Dispatch, SetStateAction } from 'react';

const FormLabelFilter = (props: {
  labelOptions: GetFormLabelsResponse;
  setLabelFilter: Dispatch<SetStateAction<GetFormLabelsResponse>>;
}) => {
  return (
    <Autocomplete
      multiple
      id="label"
      options={props.labelOptions.map((label) => label.name)}
      getOptionLabel={(option) => option}
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
          <Box
            {...props}
            key={option}
            component="span"
            style={{ color: 'black' }}
          >
            {option}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label="Filter"
          sx={{ borderBottom: '1px solid #FFFFFF6B' }}
        />
      )}
      onChange={(_event, value) => {
        props.setLabelFilter(
          props.labelOptions.filter((label) => value.includes(label.name))
        );
      }}
    />
  );
};

export default FormLabelFilter;

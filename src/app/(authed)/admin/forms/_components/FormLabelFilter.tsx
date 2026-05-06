import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { alpha } from '@mui/material/styles';
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
            sx={(theme) => ({
              backgroundColor: alpha(
                theme.palette.mode === 'dark'
                  ? theme.palette.common.white
                  : theme.palette.primary.main,
                theme.palette.mode === 'dark' ? 0.16 : 0.12
              ),
            })}
            {...getTagProps({ index })}
            key={index}
          />
        ))
      }
      renderOption={(props, option) => {
        return (
          <Box {...props} key={option} component="span">
            {option}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label="Filter"
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
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

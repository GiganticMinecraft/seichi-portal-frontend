import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { Dispatch, SetStateAction } from 'react';

import type { GetFormLabelsResponse } from '@/lib/api-types';

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
      sx={{ minWidth: 280, flexGrow: 1 }}
      slotProps={{
        listbox: {
          sx: {
            '& .MuiAutocomplete-option': {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          },
        },
        popper: { sx: { minWidth: 280 } },
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

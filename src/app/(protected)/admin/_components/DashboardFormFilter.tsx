import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { Dispatch, SetStateAction } from 'react';

import type { GetFormsResponse } from '@/lib/api-types';

const DashboardFormFilter = (props: {
  formOptions: GetFormsResponse;
  setFormFilter: Dispatch<SetStateAction<GetFormsResponse>>;
}) => {
  return (
    <Autocomplete
      multiple
      id="dashboard-form-filter"
      options={props.formOptions.map((form) => form.title)}
      getOptionLabel={(option) => option}
      sx={{ minWidth: 240, flexGrow: 1 }}
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
        popper: { sx: { minWidth: 240 } },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          size="small"
          label="種別で絞り込み"
        />
      )}
      onChange={(_event, value) => {
        props.setFormFilter(
          props.formOptions.filter((form) => value.includes(form.title))
        );
      }}
    />
  );
};

export default DashboardFormFilter;

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import type { GetFormsResponse } from '@/lib/api-types';

const DashboardFormFilter = (props: {
  formOptions: GetFormsResponse;
  selectedFormIds: string[];
  onChange: (formIds: string[]) => void;
}) => {
  const selectedTitles = props.formOptions
    .filter((form) => props.selectedFormIds.includes(form.id))
    .map((form) => form.title);

  return (
    <Autocomplete
      multiple
      id="dashboard-form-filter"
      options={props.formOptions.map((form) => form.title)}
      getOptionLabel={(option) => option}
      value={selectedTitles}
      sx={{
        minWidth: { xs: 0, sm: 240 },
        width: { xs: '100%', sm: 'auto' },
        flexGrow: 1,
      }}
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
        props.onChange(
          props.formOptions
            .filter((form) => value.includes(form.title))
            .map((form) => form.id)
        );
      }}
    />
  );
};

export default DashboardFormFilter;

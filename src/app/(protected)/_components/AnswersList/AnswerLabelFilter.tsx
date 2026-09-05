import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import type { GetAnswerLabelsResponse } from '@/lib/api-types';

const AnswerLabelFilter = (props: {
  labelOptions: GetAnswerLabelsResponse;
  selectedLabelIds: string[];
  onChange: (labelIds: string[]) => void;
}) => {
  const selectedNames = props.labelOptions
    .filter((label) => props.selectedLabelIds.includes(label.id))
    .map((label) => label.name);

  return (
    <Autocomplete
      multiple
      id="answer-label-filter"
      options={props.labelOptions.map((label) => label.name)}
      getOptionLabel={(option) => option}
      value={selectedNames}
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
          label="ラベルで絞り込み"
        />
      )}
      onChange={(_event, value) => {
        props.onChange(
          props.labelOptions
            .filter((label) => value.includes(label.name))
            .map((label) => label.id)
        );
      }}
    />
  );
};

export default AnswerLabelFilter;

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import type { GetFormLabelsResponse } from '@/app/api/_schemas/ResponseSchemas';

const FormLabelFilter = (props: { labelOptions: GetFormLabelsResponse }) => {
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
        // @ts-expect-error (解決方法がよくわからないのでとりあえずignoreする)
        // FIXME: あとで調べる
        <TextField
          {...params}
          variant="standard"
          label="Filter"
          sx={{ borderBottom: '1px solid #FFFFFF6B' }}
        />
      )}
    />
  );
};

export default FormLabelFilter;

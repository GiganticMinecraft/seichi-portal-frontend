import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

const FormTagFilter = () => {
  return (
    <Autocomplete
      multiple
      id="filter-forms"
      options={['Open', 'Closed']}
      getOptionLabel={(option) => option}
      defaultValue={['Open']}
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
          <Box component="span" {...props} style={{ color: 'black' }}>
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
          InputLabelProps={{ style: { color: '#FFFFFF80' } }}
        />
      )}
    />
  );
};

export default FormTagFilter;

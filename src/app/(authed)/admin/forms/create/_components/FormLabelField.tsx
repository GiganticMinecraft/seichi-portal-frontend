import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import type { GetFormLabelsResponse } from '@/app/api/_schemas/ResponseSchemas';
import type { Dispatch, SetStateAction } from 'react';

const FormLabelField = (props: {
  labelOptions: GetFormLabelsResponse;
  setLabels: Dispatch<SetStateAction<GetFormLabelsResponse>>;
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
        // @ts-expect-error (解決方法がよくわからないのでとりあえずignoreする)
        // FIXME: あとで調べる
        (<TextField
          {...params}
          variant="standard"
          label="フォームラベル設定"
          sx={{ borderBottom: '1px solid #FFFFFF6B' }}
        />)
      )}
      onChange={(_event, value) => {
        props.setLabels(
          props.labelOptions.filter((label) => value.includes(label.name))
        );
      }}
    />
  );
};

export default FormLabelField;

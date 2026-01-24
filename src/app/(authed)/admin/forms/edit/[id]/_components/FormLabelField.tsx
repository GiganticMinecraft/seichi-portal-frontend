import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import type { GetFormLabelsResponse } from '@/app/api/_schemas/ResponseSchemas';

const FormLabelField = (props: {
  formId: number;
  labelOptions: GetFormLabelsResponse;
  currentLabels: GetFormLabelsResponse;
}) => {
  const onChangeLabels = async (labels: GetFormLabelsResponse) => {
    await fetch(`/api/proxy/forms/${props.formId}/labels`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        labels: labels.map((label) => label.id),
      }),
    });
  };

  return (
    <Autocomplete
      multiple
      id="label"
      options={props.labelOptions.map((label) => label.name)}
      getOptionLabel={(option) => option}
      defaultValue={props.currentLabels.map((label) => label.name)}
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
      onChange={async (_event, value) => {
        await onChangeLabels(
          props.labelOptions.filter((label) => value.includes(label.name))
        );
      }}
    />
  );
};

export default FormLabelField;

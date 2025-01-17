import { Select } from '@chakra-ui/react';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { useAppDispatch, useAppSelector } from 'app/storeHooks';
import { fieldValueChanged } from 'features/nodes/store/nodesSlice';
import {
  ModelInputFieldTemplate,
  ModelInputFieldValue,
} from 'features/nodes/types/types';
import {
  selectModelsById,
  selectModelsIds,
} from 'features/system/store/modelSlice';
import { isEqual, map } from 'lodash';
import { ChangeEvent, memo } from 'react';
import { FieldComponentProps } from './types';

const availableModelsSelector = createSelector(
  [selectModelsIds],
  (allModelNames) => {
    return { allModelNames };
    // return map(modelList, (_, name) => name);
  },
  {
    memoizeOptions: {
      resultEqualityCheck: isEqual,
    },
  }
);

const ModelInputFieldComponent = (
  props: FieldComponentProps<ModelInputFieldValue, ModelInputFieldTemplate>
) => {
  const { nodeId, field } = props;

  const dispatch = useAppDispatch();

  const { allModelNames } = useAppSelector(availableModelsSelector);

  const handleValueChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      fieldValueChanged({
        nodeId,
        fieldName: field.name,
        value: e.target.value,
      })
    );
  };

  return (
    <Select onChange={handleValueChanged} value={field.value}>
      {allModelNames.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </Select>
  );
};

export default memo(ModelInputFieldComponent);

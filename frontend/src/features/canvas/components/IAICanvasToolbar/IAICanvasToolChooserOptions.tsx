import { ButtonGroup, Flex } from '@chakra-ui/react';
import { createSelector } from '@reduxjs/toolkit';
import {
  setBrushColor,
  setBrushSize,
  setTool,
} from 'features/canvas/store/canvasSlice';
import { useAppDispatch, useAppSelector } from 'app/store';
import _ from 'lodash';
import IAIIconButton from 'common/components/IAIIconButton';
import { FaEraser, FaPaintBrush, FaSlidersH } from 'react-icons/fa';
import {
  canvasSelector,
  isStagingSelector,
} from 'features/canvas/store/canvasSelectors';
import { systemSelector } from 'features/system/store/systemSelectors';
import { useHotkeys } from 'react-hotkeys-hook';
import IAIPopover from 'common/components/IAIPopover';
import IAISlider from 'common/components/IAISlider';
import IAIColorPicker from 'common/components/IAIColorPicker';

export const selector = createSelector(
  [canvasSelector, isStagingSelector, systemSelector],
  (canvas, isStaging, system) => {
    const { isProcessing } = system;
    const { tool, brushColor, brushSize } = canvas;

    return {
      tool,
      isStaging,
      isProcessing,
      brushColor,
      brushSize,
    };
  },
  {
    memoizeOptions: {
      resultEqualityCheck: _.isEqual,
    },
  }
);

const IAICanvasToolChooserOptions = () => {
  const dispatch = useAppDispatch();
  const { tool, brushColor, brushSize, isStaging } = useAppSelector(selector);

  useHotkeys(
    ['b'],
    () => {
      handleSelectBrushTool();
    },
    {
      enabled: () => true,
      preventDefault: true,
    },
    []
  );

  useHotkeys(
    ['e'],
    () => {
      handleSelectEraserTool();
    },
    {
      enabled: () => true,
      preventDefault: true,
    },
    [tool]
  );

  useHotkeys(
    ['['],
    () => {
      dispatch(setBrushSize(Math.max(brushSize - 5, 5)));
    },
    {
      enabled: () => true,
      preventDefault: true,
    },
    [brushSize]
  );

  useHotkeys(
    [']'],
    () => {
      dispatch(setBrushSize(Math.min(brushSize + 5, 500)));
    },
    {
      enabled: () => true,
      preventDefault: true,
    },
    [brushSize]
  );

  const handleSelectBrushTool = () => dispatch(setTool('brush'));
  const handleSelectEraserTool = () => dispatch(setTool('eraser'));

  return (
    <ButtonGroup isAttached>
      <IAIIconButton
        aria-label="Brush Tool (B)"
        tooltip="Brush Tool (B)"
        icon={<FaPaintBrush />}
        data-selected={tool === 'brush' && !isStaging}
        onClick={handleSelectBrushTool}
        isDisabled={isStaging}
      />
      <IAIIconButton
        aria-label="Eraser Tool (E)"
        tooltip="Eraser Tool (E)"
        icon={<FaEraser />}
        data-selected={tool === 'eraser' && !isStaging}
        isDisabled={isStaging}
        onClick={() => dispatch(setTool('eraser'))}
      />
      <IAIPopover
        trigger="hover"
        triggerComponent={
          <IAIIconButton
            aria-label="Brush Options"
            tooltip="Brush Options"
            icon={<FaSlidersH />}
          />
        }
      >
        <Flex
          minWidth={'15rem'}
          direction={'column'}
          gap={'1rem'}
          width={'100%'}
        >
          <Flex gap={'1rem'} justifyContent="space-between">
            <IAISlider
              label="Size"
              value={brushSize}
              withInput
              onChange={(newSize) => dispatch(setBrushSize(newSize))}
              sliderNumberInputProps={{ max: 500 }}
              inputReadOnly={false}
            />
          </Flex>
          <IAIColorPicker
            style={{
              width: '100%',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
            }}
            color={brushColor}
            onChange={(newColor) => dispatch(setBrushColor(newColor))}
          />
        </Flex>
      </IAIPopover>
    </ButtonGroup>
  );
};

export default IAICanvasToolChooserOptions;
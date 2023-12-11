import { Options } from 'react-select';
import { AttSelectOption } from '../../../shared/components/att-select';
import { AlgosBySectionDict } from '../hooks';
import { algorithmSections } from '../constants';

export function handleAlgorithmsSelection(
  selectedAlgorithms: Options<AttSelectOption>,
  algorithmOptions: AttSelectOption[],
  algosBySection: AlgosBySectionDict,
  prevSelectedValues: string[]
  ) {
    let selectedValues: string[] = selectedAlgorithms.map(option => option.value);
    let newSelectedSections: string[] = [];
    let newSelectedOptions: AttSelectOption[] = [];

    for (const section of algorithmSections) {
      // If no algorithms are selected, enable all the sections
      if (!selectedAlgorithms.length) {
        algorithmOptions.map((algo) => algo.value === section && algo.isDisabled ? algo.isDisabled = false : undefined)
      }
      // If a new section is selected, add all its options to the selected options
      if (selectedValues.includes(section) && !prevSelectedValues.includes(section)) {
        newSelectedSections.push(section);
        selectedValues = selectedValues.filter((algo) => algo !== section).concat(algosBySection[section].map(opt => opt.value));
        newSelectedOptions = newSelectedOptions.filter(option => !algosBySection[section].map(opt => opt.value).includes(option.value));
        // Disable the section title
        selectedAlgorithms.map((algo) => algo.value === section ? algo.isDisabled = true : undefined)
      } else if (!selectedValues.includes(section) && prevSelectedValues.includes(section)) {
        // If something inside the section is changed, update the selected options
        newSelectedOptions = selectedAlgorithms.filter(option => !algosBySection[section].map(opt => opt.value).includes(option.value));
      }
    }

    for (const option of algorithmOptions) {
      // If the option is selected and it's not already in the new selected options, add it
      if (!newSelectedSections.includes(option.value) &&
          selectedValues.includes(option.value) &&
          !newSelectedOptions.map(opt => opt.value).includes(option.value)) 
      {
        newSelectedOptions.push(option);
        // Check if all the options inside a section are selected
        // If they are, disable the section title, otherwise enable it
        for (const section of algorithmSections) {
          const sectionOptions = algosBySection[section].map(opt => opt.value);

          (sectionOptions.every(opt => selectedValues.includes(opt)))
          ? algorithmOptions.map((algo) => algo.value === section ? algo.isDisabled = true : undefined)
          : algorithmOptions.map((algo) => algo.value === section ? algo.isDisabled = false : undefined)
        }
      }
    }

    return { newSelectedOptions, selectedValues };
}
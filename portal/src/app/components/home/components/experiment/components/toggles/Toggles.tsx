import { useState } from "react";
import { ToggleButton } from "../../../../../../shared/components/toggle-button";
import { EXPERIMENT_EN } from "../../translate/en";

export interface TogglesProps {
  currentSection: string;
  handleButtonClick: (section: string) => void;
}

export const Toggles: React.FC<TogglesProps> = (props: TogglesProps) => {
  return (
    <div>
      <ToggleButton 
          onClick={() => props.handleButtonClick(EXPERIMENT_EN.TITLES.RESULTS_DATA)}
          isSelected={props.currentSection === EXPERIMENT_EN.TITLES.RESULTS_DATA}
      >
          {EXPERIMENT_EN.TITLES.RESULTS_DATA}
      </ToggleButton>
      <ToggleButton 
          onClick={() => props.handleButtonClick(EXPERIMENT_EN.TITLES.VISUALIZATION)}
          isSelected={props.currentSection === EXPERIMENT_EN.TITLES.VISUALIZATION}
      >
          {EXPERIMENT_EN.TITLES.VISUALIZATION}
      </ToggleButton>
    </div>
  );
}

import { useState } from "react";
import { ToggleButton } from "../../../../../../shared/components/toggle-button";
import { EXPERIMENT_EN } from "../../translate/en";

export const Toggles: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(EXPERIMENT_EN.TITLES.RESULTS_DATA);
  
  return (
    <div>
      <ToggleButton 
          onClick={() => setCurrentSection(EXPERIMENT_EN.TITLES.RESULTS_DATA)}
          isSelected={currentSection === EXPERIMENT_EN.TITLES.RESULTS_DATA}
      >
          {EXPERIMENT_EN.TITLES.RESULTS_DATA}
      </ToggleButton>
      <ToggleButton 
          onClick={() => setCurrentSection(EXPERIMENT_EN.TITLES.VISUALIZATION)}
          isSelected={currentSection === EXPERIMENT_EN.TITLES.VISUALIZATION}
      >
          {EXPERIMENT_EN.TITLES.VISUALIZATION}
      </ToggleButton>
    </div>
  );
}

import { ExperimentTabButton } from "../../../../../../shared/components/experiment-tab-button";
import { EXPERIMENT_EN } from "../../translate/en";

export interface ExperimentTabsProps {
  currentSection: string;
  handleButtonClick: (section: string) => void;
}

export const ExperimentTabs: React.FC<ExperimentTabsProps> = (props: ExperimentTabsProps) => {
  const titles = [EXPERIMENT_EN.TABS.RESULTS_DATA, EXPERIMENT_EN.TABS.VISUALIZATION];

  return (
    <div>
      {titles.map((title) => (
        <ExperimentTabButton 
          key={title}
          onClick={() => props.handleButtonClick(title)}
          isSelected={props.currentSection === title}
        >
          {title}
        </ExperimentTabButton>
      ))}
    </div>
  );
}

import styles from './TableOptions.module.scss';
import { TABLE_OPTIONS_EN } from './translate/en';
import SelectColumnsSvg from '../../../../../../../assets/images/select-columns.svg';
import EyeSvg from '../../../../../../../assets/images/eye.svg';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../../../../../shared/components/att-button';
import { ExternalLink, LinkRel, LinkSize, LinkStyle, LinkTarget } from '../../../../../../shared/components/att-link';
import { useEffect, useState } from 'react';
import { Environment } from '../../../../../../../environments/environment';
import { DashBoardPrefixLink } from '../../../../../../shared/constants/dashboard';
import { ITestRunResult } from '../../../../../../shared/models/test-run-result.interface';
import { initialLink } from './constants/table-options.const';

const SelectColumnsAriaLabel: string = TABLE_OPTIONS_EN.SELECT_COLUMNS;

export interface TableOptionsProps {
  data: ITestRunResult;
  handleSelectColumnsClick: () => void;
  isPopupOpen: boolean;
}

export const TableOptions: React.FC<TableOptionsProps> = (props: TableOptionsProps) => {
  const [grafanaLink, setGrafanaLink] = useState<string>(initialLink);

  useEffect(() => {
    if (props.data) {
        const dashboardLink: string = `${Environment.dashboardLinkHost}/${DashBoardPrefixLink}&from=${props.data.start_time}&to=${props.data.end_time}`;
        setGrafanaLink(dashboardLink);
    }
  }, [props.data]);

  return (
    <div className={styles.table_options_wrapper}>
      <ExternalLink
        className={styles.link_wrapper}
        link={grafanaLink}
        styleType={LinkStyle.TEXT}
        size={LinkSize.NONE}
        target={LinkTarget.BLANK}
        rel={LinkRel.NO_OPENER}
      >
        <div className={styles.grafana_link}>
            <img className={styles.eye_icon} src={EyeSvg} alt="eye" />
            {TABLE_OPTIONS_EN.VIEW_TO_GRAFANA}
        </div>
      </ExternalLink>
      <Button
        ariaLabel={SelectColumnsAriaLabel}
        size={ButtonSize.NONE}
        styleType={ButtonStyleType.WRAPPER}
        actionType={ButtonActionType.BUTTON}
        onButtonClick={props.handleSelectColumnsClick}
      >
        <div className={styles.options_wrapper}>
          <img className ={styles.select_columns_icon} src={SelectColumnsSvg} alt={SelectColumnsAriaLabel} />
          <span className={styles.select_columns_text}>{TABLE_OPTIONS_EN.SELECT_COLUMNS}</span>
        </div>
      </Button>
    </div>
  );
};

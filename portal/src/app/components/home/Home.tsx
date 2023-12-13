import { Environment } from "../../../environments/environment";
import { useDashboardData } from "../../hooks/useDashboardData";
import { ExternalLink, LinkRel, LinkSize, LinkStyle, LinkTarget } from "../../shared/components/att-link";
import { DashBoardPrefixLink } from "../../shared/constants/dashboard";
import { FetchDataStatus } from "../../shared/hooks/useFetch";
import { ITestParams } from "../../shared/models/quantum.interface";
import { SHARED_EN } from "../../shared/translate/en";
import { ProtocolQuery } from "../protocol-query";
import { SubHeader } from "../sub-header";
import { useCallback, useEffect, useState } from 'react';
import styles from './Home.module.scss';
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {
    const [isSubHeaderOpen, setIsSubHeaderOpen] = useState<boolean>(true);
  
    const handleSubHeaderCloseClick: () => void = useCallback((): void => {
      setIsSubHeaderOpen(false);
    }, []);
    
    return (
      <>
        {isSubHeaderOpen && <SubHeader handleCloseClick={handleSubHeaderCloseClick} />}
        <HomeContent />
      </>
    );  
}

const generateFromTime: number = Date.now();
const initialLink: string = `${Environment.dashboardLinkHost}/${DashBoardPrefixLink}&from=${generateFromTime}`;
export const HomeContent: React.FC = () => {
  const { handleRunQueryClick, link, status } = useDashboardData();
  const [dashBoardLink, setDashBoardLink] = useState<string>(link);
  const [displayLinkButton, setDisplayLinkButton] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === FetchDataStatus.Success) {
      // Navigate to the Experiment page
      navigate('/experiment',  { replace: true });
    }
  }, [navigate, status]);

  useEffect(() => {
    setDashBoardLink(link);
  }, [link]);
  
  const handleRunClick: (params: ITestParams) => void = useCallback((params: ITestParams): void => {
    if (params.algorithms && params.iterationsCount) {
      setDisplayLinkButton(true);
      handleRunQueryClick(params);
      setDashBoardLink(initialLink);
    }
  }, [handleRunQueryClick]);

  return (
    <div className={styles.app_wrapper}>
      {!dashBoardLink?.length && <div className={styles.protocol_query_title}>{SHARED_EN.TITLE}</div>}
      <ProtocolQuery isFetching={status === FetchDataStatus.Fetching} onRunClick={handleRunClick} />
      {(dashBoardLink?.length > 0 && displayLinkButton) &&
        <div className={styles.response_wrapper}>
          <ExternalLink
              className={styles.response_link}
              link={dashBoardLink}
              styleType={LinkStyle.TEXT}
              size={LinkSize.NONE}
              target={LinkTarget.BLANK}
              rel={LinkRel.NO_OPENER}
            >
              {SHARED_EN.LINK_TEXT}
          </ExternalLink>
        </div>
        }
    </div>
  );
};

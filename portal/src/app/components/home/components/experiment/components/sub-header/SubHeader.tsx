import styles from './SubHeader.module.scss';
import { Link } from "react-router-dom";
import { SUB_HEADER_EN } from "./translate/en";
import ArrowLeftSvg from '../../../../../../../../src/assets/images/arrow-left.svg';

export const SubHeader: React.FC = () => {
    return (
        <div className={styles.sub_header_wrapper}>
          <Link className={styles.back_link} to="/">
            <img className={styles.arrow_icon} src={ArrowLeftSvg} alt="arrow" />
            {SUB_HEADER_EN.BACK_HOME_LINK}
          </Link>
        </div>
    );
}


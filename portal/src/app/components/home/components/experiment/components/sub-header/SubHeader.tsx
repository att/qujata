import styles from './SubHeader.module.scss';
import { Link } from "react-router-dom";
import ArrowLeftSvg from '../../../../../../../../src/assets/images/arrow-left.svg';

interface SubHeaderProps {
    linkTitle: string;
}
export const SubHeader: React.FC<SubHeaderProps> = (props: SubHeaderProps) => {
    return (
        <div className={styles.sub_header_wrapper}>
          <Link className={styles.back_link} to="/">
            <img className={styles.arrow_icon} src={ArrowLeftSvg} alt="arrow" />
            {props.linkTitle}
          </Link>
        </div>
    );
}


import cn from 'classnames';
import styles from './QujataInsight.module.scss';
import { Link } from 'react-router-dom';
import QujataLogoPurpleSvg from '../../../../assets/images/qujata-logo-purple.svg';

const CloseAriaLabel: string = 'Close';
const InsightAriaLabel: string = 'Insight';
const LogoAriaLabel: string = 'QujataLogo';

export interface QujataInsightsProps {
  className?: string;
  closeImageUrl: string;
  onInsightClose: () => void;
  imageUrl?: string;
  title: string;
  description: string;
  linkName: string;
  linkUrl: string;
}

export const QujataInsight = ({ className, closeImageUrl, onInsightClose, imageUrl, title, description, linkName, linkUrl }: QujataInsightsProps) => {
  return (
    <div className={cn(styles.container, className)}>
      <img src={closeImageUrl} alt={CloseAriaLabel} className={styles.close_insight_button} onClick={onInsightClose} />
      {imageUrl && <img src={imageUrl} alt={InsightAriaLabel} className={styles.image} />}
      <div className={styles.divider} />
      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <img className={styles.qujata_icon} src={QujataLogoPurpleSvg} alt={LogoAriaLabel} />
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div>{description}</div>
        <Link to={linkUrl} className={styles.link}>{linkName}</Link>
      </div>
    </div>
  );
};

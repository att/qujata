import { ISubHeaderItem } from "../models/sub-header.interface";
import { SUB_HEADER_EN } from "../translate/en";
import HandshakeSvg from '../../../../assets/images/handshake.svg';
import KeysSvg from '../../../../assets/images/keys.svg';
import LockSvg from '../../../../assets/images/lock.svg';
import CheckSvg from '../../../../assets/images/check.svg';
import DownloadSvg from '../../../../assets/images/download.svg';

export const SubHeaderItems: ISubHeaderItem[] = [
  {
    description: SUB_HEADER_EN.DESCRIPTIONS.STEP_1,
    icon: HandshakeSvg,
    alt: SUB_HEADER_EN.ALT_TITLES.HANDSHAKE,
  },
  {
    description: SUB_HEADER_EN.DESCRIPTIONS.STEP_2,
    icon: KeysSvg,
    alt: SUB_HEADER_EN.ALT_TITLES.KEYS,
  },
  {
    description: SUB_HEADER_EN.DESCRIPTIONS.STEP_3,
    icon: LockSvg,
    alt: SUB_HEADER_EN.ALT_TITLES.LOCK,
  },
  {
    description: SUB_HEADER_EN.DESCRIPTIONS.STEP_4,
    icon: DownloadSvg,
    alt: SUB_HEADER_EN.ALT_TITLES.DOWNLOAD,
  },
  {
    description: SUB_HEADER_EN.DESCRIPTIONS.STEP_5,
    icon: CheckSvg,
    alt: SUB_HEADER_EN.ALT_TITLES.CHECK,
  }
];

import { Environment } from "../../../../../../environments/environment";
import { DashBoardPrefixLink } from "../../../../../shared/constants/dashboard";

const generateFromTime: number = Date.now();
export const initialLink: string = `${Environment.dashboardLinkHost}/${DashBoardPrefixLink}&from=${generateFromTime}`;

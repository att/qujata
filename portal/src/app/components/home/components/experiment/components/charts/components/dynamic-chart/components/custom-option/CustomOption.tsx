import { GroupBase, OptionProps, components } from "react-select";
import styles from './CustomOption.module.scss';
import { AttSelectOption } from "../../../../../../../../../../shared/components/att-select";
import { capitalizeFirstLetter, getIconByValue } from "../../utils/dynamic-chart.utils";

export type SelectorCustomOptionProps = OptionProps<AttSelectOption<any>, true, GroupBase<AttSelectOption<any>>> & {
    onOptionChanged: (option: AttSelectOption) => void;
    showInputOption: boolean;
    setShowInputOption: (show: boolean) => void;
    inputValue: string;
    setInputValue: (value: string) => void;
    setMenuIsOpen: (isOpen: boolean) => void;
};

export const CustomOption: React.FC<SelectorCustomOptionProps> = (props: SelectorCustomOptionProps) => {
    const option: any = props.data;

    return (
        <components.Option {...props}>
            <img className={styles.icon} src={getIconByValue(option.value)} alt={option.value} />
            <span>{capitalizeFirstLetter(option.value)}</span>
        </components.Option>
    );
};

import { useCallback } from "react";
import { DropdownIndicatorProps, components } from "react-select";
import { AttSelectOption } from "../../../../../../../../../../shared/components/att-select";
import { ReactComponent as ArrowDownSelectorSvg } from '../../../../../../../../../../../assets/images/arrow-down-selector.svg';

export const CustomDropdownIndicator: React.FC<DropdownIndicatorProps<AttSelectOption, any>> = (props) => {
    const { selectProps } = props;

    const handleClick: () => void = useCallback((): void => {
        if (selectProps.menuIsOpen) {
            selectProps.onMenuClose();
        } else {
            selectProps.onMenuOpen();
        }
    }, [selectProps]);
    
    return (
        <div onClick={handleClick} >
            <components.DropdownIndicator {...props}>
                <ArrowDownSelectorSvg />
            </components.DropdownIndicator>
        </div>
    );
};

import { ValueContainerProps, components } from "react-select"
import { ChartType } from "../../models/dynamic-chart.interface";
import styles from './CustomValueContainer.module.scss';
import { AttSelectOption } from "../../../../../../../../../../shared/components/att-select";
import { PropsWithChildren, useCallback, useRef } from "react";
import cn from 'classnames';
import { capitalizeFirstLetter, getIconByValue } from "../../utils/dynamic-chart.utils";
import { useOutsideClick } from "../../../../../../../../../../hooks/useOutsideClick";

export const CustomValueContainer: React.FC<ValueContainerProps<AttSelectOption, boolean>> = (props: PropsWithChildren<ValueContainerProps<AttSelectOption, boolean>>) => {
    const placeholder: string = props.selectProps?.placeholder as string;
    const inputValue: string = props.selectProps?.inputValue as string;
    const containerRef = useRef(null);

    useOutsideClick(containerRef, () => {
        if (props.selectProps.menuIsOpen) {
          props.selectProps.onMenuClose();
        }
    });

    const handleClick: () => void = useCallback((): void => {
        if (!props.selectProps.menuIsOpen) {
            props.selectProps.onMenuOpen();
        }
    }, [props.selectProps]);

    return (
        <div onClick={handleClick} ref={containerRef}>
            <components.ValueContainer {...props} >
                <div className={styles.input_wrapper}>
                    {props.hasValue && <img className={styles.icon} src={getIconByValue(inputValue as ChartType)} alt={inputValue} />}
                    <span className={cn({[styles.value]: props.hasValue}, {[styles.placeholder]: !props.hasValue})}>{props.hasValue && props.getValue() ? capitalizeFirstLetter(props.getValue()[0]?.value) : placeholder}</span>
                </div>
            </components.ValueContainer>
        </div>
    )
}
  
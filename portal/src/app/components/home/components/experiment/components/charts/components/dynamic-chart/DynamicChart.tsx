import { ChartType, chartTypeOptions, xAxisTypeOptions } from "./models/dynamic-chart.interface";
import styles from './DynamicChart.module.scss';
import { AttSelect, AttSelectOption, OnSelectChanged } from "../../../../../../../../shared/components/att-select";
import { useCallback, useEffect, useState } from "react";
import { SelectOptionType } from "../../../../../../../protocol-query";
import { ITestRunResult } from "../../../../../../../../shared/models/test-run-result.interface";
import { useDynamicChartData } from "./hooks/useDynamicChartData";
import { DYNAMIC_CHART_EN } from "./translate/en";
import { CustomValueContainer } from "./components/custom-value-container";
import { CustomOption } from "./components/custom-option";
import { CustomDropdownIndicator } from "./components/custom-dropdown-indicator";
import { BarChart } from "../../../../../../../dashboard/components/charts/BarChart";
import { useChartsData } from "../../hooks/useChartsData";
import { tooltipKeys, tooltipLabels } from "../../models/bar-chart.const";
import { getTitleByXAxiosValue } from "./utils/dynamic-chart.utils";
import { LineChart } from "../../../../../../../dashboard/components/charts/LineChart";
import { getChartTitleByType } from "../../utils/chart.utils";

export interface DynamicChartProps {
    chartData: ITestRunResult;
    xDefaultOption: AttSelectOption;
    yDefaultOption: AttSelectOption;
    chartDefaultType: AttSelectOption;
}
export const DynamicChart: React.FC<DynamicChartProps> = (props: DynamicChartProps) => {
    const { chartData, xDefaultOption, yDefaultOption, chartDefaultType } = props;
    const { yAxiosOptions } = useDynamicChartData(chartData);
    const [chartType, setChartType] = useState<AttSelectOption>(chartDefaultType);
    const [xAxisValue, setXAxisValue] = useState<AttSelectOption>(xDefaultOption);
    const [yAxisValue, setYAxisValue] = useState<AttSelectOption>(yDefaultOption);
    const { barChartData, barChartLabels, lineChartData } = useChartsData({ data: chartData });
    const [lineChartConvertData, setLineChartConvertData] = useState<{labels: number[], datasets: unknown}>();

    useEffect(() => {
        if (lineChartData) {
            const datasets = lineChartData.datasets
            .filter(dataset => dataset.data[yAxisValue?.value as string])
            .map(dataset => ({
                ...dataset,
                data: dataset.data[yAxisValue?.value as string]
            }));
            
            setLineChartConvertData({
                labels: lineChartData.labels,
                datasets: datasets.length === 0 ? null : datasets,
            });
        }
    }, [lineChartData, yAxisValue?.value]);

    const onChartTypeChanged: OnSelectChanged = useCallback((options: SelectOptionType): void => {
        const selectedChartType: AttSelectOption = options as AttSelectOption;
        setChartType(selectedChartType);
    }, []);

    const onXAxisValueChanged: OnSelectChanged = useCallback((options: SelectOptionType): void => {
        const selectedXAxisValue: AttSelectOption = options as AttSelectOption;
        setXAxisValue(selectedXAxisValue);
    }, []);

    const onYAxisValueChanged: OnSelectChanged = useCallback((options: SelectOptionType): void => {
        const selectedYAxisValue: AttSelectOption = options as AttSelectOption;
        setYAxisValue(selectedYAxisValue);
    }, []);

    return (
        <div className={styles.chart_wrapper}>
            <div className={styles.chart_filters}>
                <div className={styles.select_item_wrapper}>
                    <label htmlFor='yAxiosSelector'>{DYNAMIC_CHART_EN.SELECTORS.LABELS.Y_AXIOS}</label>
                    <AttSelect
                        id='yAxiosSelector'
                        className={styles.select_item}
                        placeholder={DYNAMIC_CHART_EN.SELECTORS.PLACEHOLDERS.Y_AXIOS}
                        options={yAxiosOptions}
                        value={yAxisValue as AttSelectOption}
                        onChange={onYAxisValueChanged}
                        required
                    />
                </div>
                <div className={styles.select_item_wrapper}>
                    <label htmlFor='xAxiosSelector'>{DYNAMIC_CHART_EN.SELECTORS.LABELS.X_AXIOS}</label>
                    <AttSelect
                        id='xAxiosSelector'
                        className={styles.select_item}
                        options={xAxisTypeOptions}
                        placeholder={DYNAMIC_CHART_EN.SELECTORS.PLACEHOLDERS.X_AXIOS}
                        value={xAxisValue as AttSelectOption}
                        onChange={onXAxisValueChanged}
                        required
                    />
                </div>
                <div className={styles.select_item_wrapper}>
                    <AttSelect
                        className={styles.select_type_item}
                        options={chartTypeOptions}
                        placeholder={DYNAMIC_CHART_EN.SELECTORS.PLACEHOLDERS.CHART_TYPE}
                        value={chartType as AttSelectOption}
                        onChange={onChartTypeChanged}
                        customComponent={{ Option: CustomOption as React.FC, ValueContainer: CustomValueContainer as React.FC, DropdownIndicator: CustomDropdownIndicator as React.FC }}
                        required
                    />
                </div>
            </div>

            {xAxisValue?.value && chartType?.value && yAxisValue?.value &&
                <>
                    {chartType?.value === ChartType.BAR && barChartData && <BarChart title={getTitleByXAxiosValue(xAxisValue.value)} labels={barChartLabels} data={barChartData} tooltipKeys={tooltipKeys} tooltipLabels={tooltipLabels} keyOfData={yAxisValue.value} />}
                    {chartType?.value === ChartType.LINE && lineChartConvertData && <LineChart data={lineChartConvertData} title={getTitleByXAxiosValue(xAxisValue.value)} tooltipLabel={getChartTitleByType(yAxisValue.value)} />}
                </>
            }
        </div>
    );
}

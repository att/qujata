import { AttSelectOption } from "../../../shared/components/att-select";
import { IHttp, useFetch } from "../../../shared/hooks/useFetch";
import { useEffect, useState } from "react";
import { APIS } from "../../../apis";

type AlgosBySectionDict = { [key: string]: AttSelectOption[] };

export interface IUseGetAlgorithms {
    algorithmOptions: AttSelectOption[];
    algosBySection: AlgosBySectionDict;
}

interface IAlgorithm {
    classic: string[];
    hybrid: string[];
    quantumSafe: string[];
}

export const algorithmSections = ['Classic', 'Hybrid', 'PQ'];
export function useGetAlgorithms(): IUseGetAlgorithms {
    const [algorithmOptions, setOptions] = useState<AttSelectOption[]>([]);
    const [algosBySection, setAlgosBySection] = useState<AlgosBySectionDict>({});
    const { get, data, cancelRequest }: IHttp<IAlgorithm> = useFetch({ url: APIS.algorithms });

    useEffect(() => {
        get();
        return cancelRequest;
    }, [get, cancelRequest]);


    useEffect(() => {
        if (data) {
            const algorithmTitles: AttSelectOption[] = algorithmSections.map((algo: string) => ({ label: algo, value: algo }));
            const classicOptions: AttSelectOption[] = data.classic.map((algo: string) => ({ label: algo, value: algo }));
            const hybridOptions: AttSelectOption[] = data.hybrid.map((algo: string) => ({ label: algo, value: algo }));
            const quantumSafeOptions: AttSelectOption[] = data.quantumSafe.map((algo: string) => ({ label: algo, value: algo }));

            setOptions([
                algorithmTitles[0],
                ...classicOptions,
                algorithmTitles[1],
                ...hybridOptions,
                algorithmTitles[2],
                ...quantumSafeOptions
            ]);

            setAlgosBySection({
                [algorithmSections[0]]: classicOptions.concat(algorithmTitles[0]),
                [algorithmSections[1]]: hybridOptions.concat(algorithmTitles[1]),
                [algorithmSections[2]]: quantumSafeOptions.concat(algorithmTitles[2])
            })
        }
    }, [data]);

    return { algorithmOptions, algosBySection };
}

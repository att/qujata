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

export const algorithmSections = ['All', 'Classic', 'Hybrid', 'PQ'];
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
                algorithmTitles[1],
                ...classicOptions,
                algorithmTitles[2],
                ...hybridOptions,
                algorithmTitles[3],
                ...quantumSafeOptions
            ]);

            setAlgosBySection({
                [algorithmSections[0]]: classicOptions.concat(hybridOptions, quantumSafeOptions),
                [algorithmSections[1]]: classicOptions,
                [algorithmSections[2]]: hybridOptions,
                [algorithmSections[3]]: quantumSafeOptions
            })
        }
    }, [data]);

    return { algorithmOptions, algosBySection };
}

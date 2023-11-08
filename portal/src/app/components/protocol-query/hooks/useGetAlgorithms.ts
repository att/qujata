import { AttSelectOption } from "../../../shared/components/att-select";
import { IHttp, useFetch } from "../../../shared/hooks/useFetch";
import { useEffect, useState } from "react";
import { APIS } from "../../../apis";

export interface IUseGetAlgorithms {
    options: AttSelectOption[];
}

interface IAlgorithm {
    classic: string[];
    hybrid: string[];
    quantumSafe: string[];
}
export function useGetAlgorithms(): IUseGetAlgorithms {
    const [options, setOptions] = useState<AttSelectOption[]>([]);
    const { get, data, cancelRequest }: IHttp<IAlgorithm> = useFetch({ url: APIS.algorithms });

    useEffect(() => {
        get();
        return cancelRequest;
    }, [get, cancelRequest]);


    useEffect(() => {
        if (data) {
            const classicOptions: AttSelectOption[] = data.classic.map((algo: string) => ({ label: algo, value: algo }));
            const hybridOptions: AttSelectOption[] = data.hybrid.map((algo: string) => ({ label: algo, value: algo }));
            const quantumSafeOptions: AttSelectOption[] = data.quantumSafe.map((algo: string) => ({ label: algo, value: algo }));
            const algorithmTitles: AttSelectOption[] = ['─────────── Classic ─────────────', '─────────── Hybrid ─────────────', '─────────── PQ ──────────────']
                .map((algo: string) => ({ label: algo, value: algo, isDisabled: true }));
            setOptions([
                algorithmTitles[0],
                ...classicOptions,
                algorithmTitles[1],
                ...hybridOptions,
                algorithmTitles[2],
                ...quantumSafeOptions
            ]);
        }
    }, [data]);

    return { options };
}

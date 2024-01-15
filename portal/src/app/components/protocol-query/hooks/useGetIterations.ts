import { AttSelectOption } from "../../../shared/components/att-select";
import { IHttp, useFetch } from "../../../shared/hooks/useFetch";
import { useEffect, useState } from "react";
import { APIS } from "../../../apis";
import { SELECTOR_CUSTOM_OPTION_EN } from "../../../shared/components/selector-custom-option/translate/en";

export interface IUseGetIterations {
  iterationsOptions: AttSelectOption[];
}

interface INumOfIterations {
  iterations: number[];
}

export function useGetIterations(): IUseGetIterations {
    const [iterationsOptions, setIterations] = useState<AttSelectOption[]>([]);
    const { get, data, cancelRequest }: IHttp<INumOfIterations> = useFetch({ url: APIS.iterations });

    useEffect(() => {
      get();  
      return cancelRequest;
    }, [get, cancelRequest]);


    useEffect(() => {
      if (data) {
        const iterationsOptions: AttSelectOption[] = data.iterations.map((iteration: number) => ({ label: iteration.toString(), value: iteration.toString() }));
        setIterations([
          ...iterationsOptions,
          { label: SELECTOR_CUSTOM_OPTION_EN.ADD_NEW, value: SELECTOR_CUSTOM_OPTION_EN.ADD_NEW, metadata: { isInput: true }},
          { label: SELECTOR_CUSTOM_OPTION_EN.ADD_NEW_BUTTON, value: SELECTOR_CUSTOM_OPTION_EN.ADD_NEW_BUTTON, metadata: { isAddNewButton: true }}
        ]);
      }
    }, [data]);

    return { iterationsOptions };
}

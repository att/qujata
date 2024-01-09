import { AttSelectOption } from "../../../shared/components/att-select";
import { IHttp, useFetch } from "../../../shared/hooks/useFetch";
import { useEffect, useState } from "react";
import { APIS } from "../../../apis";

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
          { label: 'Add New', value: 'Add New', metadata: { isInput: true }},
          { label: '+ Add new', value: '+ Add new', metadata: { isAddNewButton: true }}
        ]);
      }
    }, [data]);

    return { iterationsOptions };
}

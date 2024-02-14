import { AttSelectOption } from "../../../shared/components/att-select";
import { IHttp, useFetch } from "../../../shared/hooks/useFetch";
import { useEffect, useState } from "react";
import { APIS } from "../../../apis";
import { SELECTOR_CUSTOM_OPTION_EN } from "../../../shared/components/selector-custom-option/translate/en";

export interface IUseMessageSizeData {
  messageSizeOptions: AttSelectOption[];
}

interface IMessageSize {
  message_sizes: number[];
}

export function useMessageSizeData(): IUseMessageSizeData {
    const [messageSizeOptions, setMessageSize] = useState<AttSelectOption[]>([]);
    const { get, data, cancelRequest }: IHttp<IMessageSize> = useFetch({ url: APIS.message_sizes });

    useEffect(() => {
      get();  
      return cancelRequest;
    }, [get, cancelRequest]);


    useEffect(() => {
      if (data) {
        const messageSizeOptions: AttSelectOption[] = data.message_sizes.map((message_size: number) => ({ label: message_size.toString(), value: message_size.toString() }));
        setMessageSize([
          ...messageSizeOptions,
          { label: SELECTOR_CUSTOM_OPTION_EN.ADD_NEW, value: SELECTOR_CUSTOM_OPTION_EN.ADD_NEW, metadata: { isInput: true }},
          { label: SELECTOR_CUSTOM_OPTION_EN.ADD_NEW_BUTTON, value: SELECTOR_CUSTOM_OPTION_EN.ADD_NEW_BUTTON, metadata: { isAddNewButton: true }}
        ]);
      }
    }, [data]);

    return { messageSizeOptions };
}

import React from 'react';
import InputCustom from "../../../../../../../../../../../../components/InputCustom";

interface Props {
    onChange: (value: string) => void;
    value: string;
}

const Content: React.FC<Props> = (props: Props) => {

    return (
        <div className="flex flex-col p-5">
            <InputCustom title="CPF do supervisor" typeInput="mask" mask="999.999.999-99" placeholder="Informe o cpf do supervisor" onChange={(value: string) => props.onChange(value)} value={props.value} />
        </div>
    )
}

export default Content;
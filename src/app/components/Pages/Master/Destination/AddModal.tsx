import ModalLayout from "../../../Modal/AddModalLayout";

export default function AddModalLayout({onSubmit, register, close, parts}: {onSubmit: any, register:any, close:any, parts:any}) {
    return (
        <ModalLayout onSubmit={onSubmit} close={close}>
            <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <label className="w-1/4">Nama Destinasi:</label>
                    <input required {...register("name")} className="border border-gray-300 p-1 flex-grow"/>
                </div>
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <label className="w-1/4">Part:</label>
                    <select required {...register("part")} className="border border-gray-300 p-1 flex-grow">
                        {
                            parts.map((r:any) =>(
                              <option key={r.kode} value={r.kode}>{r.name}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
        </ModalLayout>
    );
}

import ModalLayout from "../../../Modal/AddModalLayout";

export default function AddModalLayout({onSubmit, register, close, vehicles}: {onSubmit:any, register:any, close:any, vehicles: any}) {
    return (
        <ModalLayout onSubmit={onSubmit} close={close}>
            <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <label className="w-1/4">Kode Part:</label>
                    <input required {...register("kode")} className="border border-gray-300 p-1 flex-grow"/>
                </div>
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <label className="w-1/4">Nama Part:</label>
                    <input required {...register("name")} className="border border-gray-300 p-1 flex-grow"/>
                </div>
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <label className="w-1/4">Vehicle:</label>
                    <select required {...register("vehicle")} className="border border-gray-300 p-1 flex-grow">
                        {
                            vehicles.map((r:any) =>(
                              <option key={r.kode} value={r.kode}>{r.kode + ' - '+  r.name}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
        </ModalLayout>
    );
}

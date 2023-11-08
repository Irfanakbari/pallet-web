import ModalLayout from "../../../Modal/AddModalLayout";

export default function AddModalLayout({onSubmit, register, close, customers, departments}:{onSubmit:any, register:any, close:any, customers:any, departments:any}) {
    return (
        <ModalLayout onSubmit={onSubmit}  close={close}>
            <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <label className="w-1/4">Kode Vehicle:</label>
                    <input defaultValue={'Otomatis'} disabled className="border border-gray-300 p-1 flex-grow"/>
                </div>
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <label className="w-1/4">Nama Department:</label>
                    <input required {...register("name")} className="border border-gray-300 p-1 flex-grow"/>
                </div>
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <label className="w-1/4">Customer:</label>
                    <select required {...register("customer")} className="border border-gray-300 p-1 flex-grow">
                        {
                            customers.map((r:any) =>(
                              <option key={r.kode} value={r.kode}>{r.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <label className="w-1/4">Department:</label>
                    <select required {...register("department")} className="border border-gray-300 p-1 flex-grow">
                        {
                            departments.map((r:any) =>(
                              <option key={r.kode} value={r.kode}>{r.name}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
        </ModalLayout>
    );
}

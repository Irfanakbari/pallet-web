import ModalLayout from "../../../Modal/AddModalLayout";

export default function AddModalLayout({onSubmit, register, close}: {onSubmit:any, register:any, close:any}) {
    return (
        <ModalLayout onSubmit={onSubmit} close={close}>
            <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <label className="w-1/4">Catatan:</label>
                    <input required {...register("catatan")} className="border border-gray-300 p-1 flex-grow"/>
                </div>
            </div>
        </ModalLayout>
    );
}

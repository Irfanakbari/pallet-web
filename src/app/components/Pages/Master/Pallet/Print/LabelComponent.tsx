import React from "react";
import { QRCode } from "react-qrcode-logo";
import { Part } from "@/app/components/Pages/Master/Part/EditCell";

interface LabelData {
  assetName: string;
  palletID: string;
  customerID: string;
  partID: string;
}

interface Props {
  name: string;
  kode: string;
  partEntity: Part
}

export class LabelComponent extends React.Component<Props> {
  render() {
    const { name, kode, partEntity } = this.props;
    const labelData: LabelData = {
      assetName: name,
      palletID: kode,
      customerID: partEntity ? `${partEntity.vehicleEntity.customerEntity.kode} - ${partEntity.vehicleEntity.customerEntity.name}` : '-',
      partID: partEntity ? `${partEntity.kode} - ${partEntity.name}` : '-',
    };

    return (
      <div className="flex w-full p-1 mt-2 h-full">
        <div className={`w-full flex flex-col border-2 border-black text-[12px]`}>
          <div className={`w-full flex flex-row p-0.5`}>
            <img src="/images/logo.png" alt="Logo" width={61} />
            <div className={`w-full text-center font-bold`}>PT VUTEQ INDONESIA</div>
          </div>
          <div className={`grow flex text-center font-normal`}>
            <table className={`w-full grow`}>
              <tbody className={`border-t border-black text-[10px]`}>
              <tr className={`w-full text-left`}>
                <td className={`border border-black bg-black text-white w-[30%]`}>Pallet Name</td>
                <td className={`text-center border border-black border-r-0`}>{labelData.assetName}</td>
              </tr>
              <tr className={`w-full text-left`}>
                <td className={`border border-black bg-black text-white`}>Pallet ID</td>
                <td className={`text-center border border-black border-r-0`}>{labelData.palletID}</td>
              </tr>
              <tr className={`w-full text-left`}>
                <td className={`border border-black bg-black text-white`}>Customer</td>
                <td className={`text-center border border-black border-r-0`}>{labelData.customerID}</td>
              </tr>
              <tr className={`w-full text-left`}>
                <td className={`border border-black bg-black text-white`}>Part</td>
                <td className={`text-center border border-black border-r-0`}>{labelData.partID}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={`grow border-2 flex items-center justify-center border-l-0 border-black`}>
          <center>
            <QRCode
              ecLevel={'Q'}
              size={71}
              value={labelData.palletID}
              qrStyle={'dots'}
            />
          </center>
        </div>
      </div>
    );
  }
}

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Fee type interfaces (unchanged)
interface BaseFeeType {
  id: string;
  name: string;
  mandatory: boolean;
}

interface AreaBasedFee extends BaseFeeType {
  rate: number;
  calculateByArea: true;
  calculateByVehicle?: never;
  importable?: never;
  voluntary?: never;
}

interface VehicleBasedFee extends BaseFeeType {
  rateMotorbike: number;
  rateCar: number;
  calculateByVehicle: true;
  calculateByArea?: never;
  importable?: never;
  voluntary?: never;
}

interface ImportableFee extends BaseFeeType {
  importable: true;
  calculateByArea?: never;
  calculateByVehicle?: never;
  voluntary?: never;
}

interface VoluntaryFee extends BaseFeeType {
  voluntary: true;
  calculateByArea?: never;
  calculateByVehicle?: never;
  importable?: never;
}

type FeeType = AreaBasedFee | VehicleBasedFee | ImportableFee | VoluntaryFee;

// Fee type definitions (unchanged)
export const FEE_TYPES: Record<string, FeeType> = {
  PHI_DICH_VU_CHUNG_CU: {
    id: 'PHI_DICH_VU_CHUNG_CU',
    name: 'Phí dịch vụ chung cư',
    rate: 10000, // VND/m²
    mandatory: true,
    calculateByArea: true,
  },
  PHI_QUAN_LY_CHUNG_CU: {
    id: 'PHI_QUAN_LY_CHUNG_CU',
    name: 'Phí quản lý chung cư',
    rate: 7000, // VND/m²
    mandatory: true,
    calculateByArea: true,
  },
  PHI_GUI_XE: {
    id: 'PHI_GUI_XE',
    name: 'Phí gửi xe',
    rateMotorbike: 70000, // VND/motorbike/month
    rateCar: 1200000, // VND/car/month
    mandatory: true,
    calculateByVehicle: true,
  },
  PHI_DIEN: {
    id: 'PHI_DIEN',
    name: 'Phí điện',
    mandatory: true,
    importable: true,
  },
  PHI_NUOC: {
    id: 'PHI_NUOC',
    name: 'Phí nước',
    mandatory: true,
    importable: true,
  },
  PHI_INTERNET: {
    id: 'PHI_INTERNET',
    name: 'Phí internet',
    mandatory: true,
    importable: true,
  },
  KHOAN_DONG_GOP: {
    id: 'KHOAN_DONG_GOP',
    name: 'Khoản đóng góp',
    mandatory: false,
    voluntary: true,
  }
};

// Household interface based on your provided sample (unchanged)
interface Household {
  id: string;
  owner: string;
  area: number;
  vehicles: {
    motorbikes: number;
    cars: number;
  };
}

interface AddEditFeePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  initialData?: any;
  title?: string;
  batchId: number;
}

const AddEditFeePopup: React.FC<AddEditFeePopupProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = 'Thêm khoản thu',
  batchId
}) => {
  const [feeType, setFeeType] = useState('');
  const [chiTiet, setChiTiet] = useState('');
  const [householdFees, setHouseholdFees] = useState<{
    [key: string]: { amount: number; auto: boolean; owner?: string }
  }>({});
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [errors, setErrors] = useState<{ feeType?: string; chiTiet?: string; householdFees?: string }>({});
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [pendingAction, setPendingAction] = useState<'close' | 'save' | null>(null);
  const [importedFileName, setImportedFileName] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [isLoadingHouseholds, setIsLoadingHouseholds] = useState(false);

  const isEditMode = Boolean(initialData);

  const selectedFeeType = FEE_TYPES[feeType as keyof typeof FEE_TYPES];

  const showHouseholdList = selectedFeeType &&
    (selectedFeeType.calculateByArea || selectedFeeType.calculateByVehicle || selectedFeeType.importable);

  const showFileImport = selectedFeeType?.importable;

  const showDescription = !selectedFeeType?.voluntary;

  const formatCurrency = (value: number): string => {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const formatInputValue = (value: string): string => {
    const numeric = value.replace(/[^\d]/g, '');
    if (!numeric) return '';
    return new Intl.NumberFormat('vi-VN').format(Number(numeric));
  };

  const calculateHouseholdFees = (type: string, householdsData: Household[]) => {
    const feeTypeObj = FEE_TYPES[type as keyof typeof FEE_TYPES];
    if (!feeTypeObj) return {};
    const newFees: typeof householdFees = {};
    householdsData.forEach(household => {
      let amount = 0;
      if ('calculateByArea' in feeTypeObj && feeTypeObj.calculateByArea) {
        amount = Math.round(household.area * feeTypeObj.rate);
      } else if ('calculateByVehicle' in feeTypeObj && feeTypeObj.calculateByVehicle) {
        amount = household.vehicles.motorbikes * feeTypeObj.rateMotorbike + household.vehicles.cars * feeTypeObj.rateCar;
      } else if ('voluntary' in feeTypeObj && feeTypeObj.voluntary) {
        amount = 0;
      }

      if (amount > 0) {
        newFees[household.id] = { amount, auto: true, owner: household.owner };
      }
    });
    return newFees;
  };

  const hasAnyMotorbikes = useMemo(() => {
    return households.some(h => h.vehicles?.motorbikes > 0);
  }, [households]);

  const hasAnyCars = useMemo(() => {
    return households.some(h => h.vehicles?.cars > 0);
  }, [households]);


  useEffect(() => {
    const fetchHouseholds = async () => {
      if (isOpen) {
        setIsLoadingHouseholds(true);
        setApiError(null);
        try {
          const response = await axios.get('http://localhost:8001/api/accountant/households');
          setHouseholds(response.data);
        } catch (error: any) {
          setApiError(error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách hộ khẩu');
          console.error('Error fetching households:', error);
          setHouseholds([]);
        } finally {
          setIsLoadingHouseholds(false);
        }
      }
    };
    fetchHouseholds();
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFeeType(initialData.type || '');
      setChiTiet(initialData.chiTiet || '');

      if (initialData.householdFees) {
        setHouseholdFees(initialData.householdFees);
      } else if (initialData.type && households.length > 0) {
        setHouseholdFees(calculateHouseholdFees(initialData.type, households));
      }
      if (initialData.importedFileName) setImportedFileName(initialData.importedFileName);
    } else {
      setFeeType('');
      setChiTiet('');
      setHouseholdFees({});
      setFile(null);
      setFileError('');
      setImportedFileName(null);
    }
  }, [initialData, isOpen, households]);

  const handleFeeTypeChange = (newType: string) => {
    setFeeType(newType);
    const feeTypeObj = FEE_TYPES[newType];

    if (feeTypeObj?.importable) {
      setHouseholdFees({});
      setFile(null);
      setImportedFileName(null);
    }
    else if ((feeTypeObj?.calculateByArea || feeTypeObj?.calculateByVehicle) && households.length > 0) {
      setHouseholdFees(calculateHouseholdFees(newType, households));
      setFile(null);
      setImportedFileName(null);
    }
    else {
      setHouseholdFees({});
      setFile(null);
      setImportedFileName(null);
    }
  };

  const handleAmountChange = (householdId: string, value: string) => {
    const numeric = value.replace(/[^\d]/g, '');
    const amount = parseInt(numeric) || 0;
    setHouseholdFees(prev => ({
      ...prev,
      [householdId]: {
        ...prev[householdId],
        amount: amount,
        auto: false
      }
    }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setFile(null);
      return;
    }
    const selectedFile = files[0];
    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls') && !selectedFile.name.endsWith('.csv')) {
      setFileError('Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV (.csv)');
      setFile(null);
      return;
    }
    setFileError('');
    setFile(selectedFile);
    setImportedFileName(selectedFile.name);
    try {
      let text = '';
      if (selectedFile.name.endsWith('.csv')) {
        text = await selectedFile.text();
      } else {
        text = await selectedFile.text();
      }
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) throw new Error('File phải có ít nhất 1 dòng dữ liệu (tiêu đề + 1 hàng dữ liệu)');
      const header = lines[0].split(',').map(s => s.trim().toLowerCase());
      const idxMaHo = header.findIndex(h => h.includes('mã hộ') || h.includes('ma ho') || h === 'id');
      const idxOwner = header.findIndex(h => h.includes('chủ hộ') || h.includes('chu ho') || h === 'owner');
      const idxAmount = header.findIndex(h => h.includes('số tiền') || h.includes('so tien') || h === 'amount');
      if (idxMaHo === -1 || idxOwner === -1 || idxAmount === -1) throw new Error('File phải có đủ 3 cột: Mã hộ, Chủ hộ, Số tiền');

      const importedFees: typeof householdFees = {};
      for (let i = 1; i < lines.length; ++i) {
        const cols = lines[i].split(',');
        if (cols.length < Math.max(idxMaHo, idxOwner, idxAmount) + 1) continue;
        const maHo = cols[idxMaHo].trim();
        const owner = cols[idxOwner].trim();
        const amount = parseInt(cols[idxAmount].replace(/[^\d]/g, '')) || 0;

        if (amount > 0) {
          importedFees[maHo] = { amount, auto: false, owner };
        }
      }
      if (Object.keys(importedFees).length === 0) throw new Error('Không có dữ liệu hợp lệ trong file hoặc tất cả số tiền là 0.');
      setHouseholdFees(importedFees);
      setFileError('');
    } catch (err: any) {
      setFileError('Lỗi đọc file: ' + (err.message || 'Định dạng không hợp lệ'));
    }
  };

  const isDirty = feeType !== '' || chiTiet !== '' || Object.keys(householdFees).length > 0 || file !== null || (initialData && (initialData.type !== feeType || initialData.chiTiet !== chiTiet || JSON.stringify(initialData.householdFees) !== JSON.stringify(householdFees)));

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!feeType) newErrors.feeType = 'Vui lòng chọn loại phí';
    if (selectedFeeType && 'voluntary' in selectedFeeType && selectedFeeType.voluntary && !chiTiet.trim()) newErrors.chiTiet = 'Vui lòng nhập mô tả cho khoản đóng góp';

    const hasValidHouseholdFees = Object.values(householdFees).some(h => h.amount > 0);
    if ((showHouseholdList || showFileImport) && !hasValidHouseholdFees) {
      newErrors.householdFees = 'Vui lòng nhập số tiền lớn hơn 0 cho ít nhất một hộ.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestClose = () => {
    if (isDirty) {
      setShowConfirmClose(true);
      setPendingAction('close');
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    setFeeType('');
    setChiTiet('');
    setHouseholdFees({});
    setFile(null);
    setFileError('');
    setShowConfirmClose(false);
    setShowConfirmSave(false);
    setPendingAction(null);
    setImportedFileName(null);
    onClose();
  };

  const handleSave = () => {
    if (!validate()) return;
    setShowConfirmSave(true);
    setPendingAction('save');
  };

  const handleSaveConfirmed = async () => {
    try {
      setIsSubmitting(true);
      setApiError(null);
      const feeTypeObj = FEE_TYPES[feeType as keyof typeof FEE_TYPES];

      const hoKhauList = Object.entries(householdFees)
        .filter(([, data]) => data.amount > 0)
        .map(([hoKhauId, data]) => ({
          hoKhauId: hoKhauId,
          owner: data.owner || '', // Assuming owner is still needed by backend for some reason, or can be removed
          soTien: data.amount
        }));

      if (hoKhauList.length === 0 && (selectedFeeType?.calculateByArea || selectedFeeType?.calculateByVehicle || selectedFeeType?.importable)) {
        setApiError('Không có khoản thu nào có số tiền lớn hơn 0 để lưu.');
        setIsSubmitting(false);
        return;
      }

      const requestData = {
        dotThuId: batchId,
        tenKhoanThu: feeTypeObj?.name || '',
        batBuoc: feeTypeObj?.mandatory || false, // Should be boolean
        ghiChu: chiTiet,
        hoKhauList // This list of households with amounts
      };

      let response;
      if (isEditMode) {
        // --- CHẾ ĐỘ CHỈNH SỬA (PUT Request) ---
        if (!initialData || !initialData.id) {
          setApiError('Không tìm thấy ID khoản thu để cập nhật.');
          setIsSubmitting(false);
          return;
        }
        response = await axios.put(
          `http://localhost:8001/api/accountant/khoanthu/${initialData.id}`, // Endpoint PUT cần ID
          requestData
        );
      } else {
        // --- CHẾ ĐỘ THÊM MỚI (POST Request) ---
        response = await axios.post(
          `http://localhost:8001/api/accountant/khoanthu`,
          requestData
        );
      }

      if (response.data) {
        // Debug log to check response structure
        console.log('Raw response:', response.data);

        const formattedData = {
          id: response.data.id,
          type: feeType,
          tenKhoan: response.data.tenKhoanThu,
          chiTiet: response.data.ghiChu,
          batBuoc: response.data.batBuoc ? 'Bắt buộc' : 'Không bắt buộc',
          householdFees: response.data.nopPhi.reduce((acc: any, nopPhi: any) => {
            // Debug log for each nopPhi record
            console.log('Processing nopPhi:', nopPhi);
            
            if (Number(nopPhi.soTien) > 0) {
              // Get hoKhauId directly from nopPhi
              const hoKhauId = nopPhi.hoKhauId || (nopPhi.hoKhau?.soHoKhau);
              
              if (hoKhauId) {
                // Get household info from state or response
                const householdInfo = households.find(h => h.id === String(hoKhauId));
                const hoKhauData = nopPhi.hoKhau;

                acc[hoKhauId] = {
                  amount: Number(nopPhi.soTien),
                  auto: selectedFeeType?.calculateByArea || selectedFeeType?.calculateByVehicle || false,
                  owner: householdInfo?.owner || 
                        hoKhauData?.chuHoInfo?.hoTen ||
                        'Không có thông tin'
                };
              }
            }
            return acc;
          }, {})
        };

        // Add importedFileName if it exists
        if (selectedFeeType?.importable && importedFileName) {
          formattedData.importedFileName = importedFileName;
        }

        // Debug log final formatted data
        console.log('Formatted data:', formattedData);

        if (onSave) onSave(formattedData);
        handleClose();
      }
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Có lỗi xảy ra khi lưu khoản thu');
      console.error('Error saving fee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleRequestClose();
  };

  const totalFeeAmount = useMemo(() => {
    return Object.values(householdFees).reduce(
      (sum, { amount }) => sum + amount,
      0
    );
  }, [householdFees]);

  const isImportFeeType = selectedFeeType?.importable;
  const isAutoFeeType = !isImportFeeType && (selectedFeeType?.calculateByArea || selectedFeeType?.calculateByVehicle);

  // NEW: Filter households before mapping
  const householdsToDisplay = useMemo(() => {
    if (selectedFeeType && 'calculateByVehicle' in selectedFeeType && selectedFeeType.calculateByVehicle) {
      // If it's a vehicle-based fee, filter out households with no vehicles
      return households.filter(household => 
        household.vehicles.motorbikes > 0 || household.vehicles.cars > 0
      );
    }
    // Otherwise, display all households
    return households;
  }, [households, selectedFeeType]);


  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={handleOverlayClick}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none" onClick={handleRequestClose} aria-label="Đóng">×</button>
            <h3 className="text-2xl font-bold text-center mb-6">{title}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại khoản thu <span className="text-red-500">*</span></label>
              <select className={`mt-1 block w-full px-3 py-2 border ${errors.feeType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} value={feeType} onChange={e => handleFeeTypeChange(e.target.value)} disabled={isEditMode}>
                <option value="">-- Chọn loại khoản thu --</option>
                {Object.values(FEE_TYPES).map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              {errors.feeType && <p className="text-xs text-red-500 mt-1">{errors.feeType}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">{selectedFeeType && 'voluntary' in selectedFeeType && selectedFeeType.voluntary ? 'Mô tả khoản đóng góp' : 'Chi tiết'} {selectedFeeType && 'voluntary' in selectedFeeType && selectedFeeType.voluntary && <span className="text-red-500">*</span>}</label>
              <textarea className={`mt-1 block w-full px-3 py-2 border ${errors.chiTiet ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} placeholder={selectedFeeType && 'voluntary' in selectedFeeType && selectedFeeType.voluntary ? "Nhập mô tả chi tiết về mục đích đóng góp..." : "Mô tả chi tiết về khoản thu..."} rows={3} value={chiTiet} onChange={e => setChiTiet(e.target.value)} />
              {errors.chiTiet && <p className="text-xs text-red-500 mt-1">{errors.chiTiet}</p>}
            </div>
            {/* Display loading state for households */}
            {isLoadingHouseholds && (
              <div className="text-center text-gray-500 my-4">Đang tải danh sách hộ khẩu...</div>
            )}
            {apiError && !isLoadingHouseholds && (
              <p className="text-sm text-red-500 my-4">{apiError}</p>
            )}

            {/* Loại phí import file: chỉ hiển thị hướng dẫn và nút chọn file nếu chưa có householdFees hoặc nếu có nhưng đang trong chế độ edit và muốn đổi file */}
            {isImportFeeType && !Object.keys(householdFees).length && (
              <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Import dữ liệu từ Excel/CSV</h4>
                <p className="text-sm text-gray-500 mb-3">
                  Định dạng file mẫu:<br/>
                  <b>Cột 1</b>: Mã hộ (ví dụ: HK001, HK002, ... hoặc ID như '1', '2')<br/>
                  <b>Cột 2</b>: Chủ hộ (ví dụ: Nguyễn Văn A, ...)<br/>
                  <b>Cột 3</b>: Số tiền (chỉ số, không có chữ VND, ví dụ: 150000)<br/>
                </p>
                <label className="flex items-center justify-center w-full">
                  <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
                  <div className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 cursor-pointer">Chọn file</div>
                </label>
                {fileError && (<p className="mt-2 text-sm text-red-500">{fileError}</p>)}
              </div>
            )}
            {/* Loại phí import file: đã có householdFees thì hiển thị bảng và nút đổi file */}
            {isImportFeeType && Object.keys(householdFees).length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm text-gray-700">File đã chọn: <b>{importedFileName || 'Chưa có file'}</b></span>
                  <label>
                    <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
                    <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded cursor-pointer hover:bg-blue-200 transition">Đổi file</span>
                  </label>
                </div>
                <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mã hộ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Chủ hộ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số tiền (VND)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(householdFees).map(([maHo, h]) => {
                        // Try to get owner from multiple sources
                        const householdDetails = households.find(hh => hh.id === maHo);
                        const ownerName = h.owner || householdDetails?.owner || h.chuHo || 'Không có thông tin';
                        
                        return (
                          <tr key={maHo}>
                            <td className="px-4 py-2 text-sm text-gray-900">{maHo}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{ownerName}</td>
                            <td className="px-4 py-2 text-sm">
                              <input
                                type="text"
                                className="block w-28 px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 text-right transition-all hover:border-blue-400 focus:bg-blue-50"
                                placeholder="0"
                                value={h.amount !== undefined ? formatCurrency(h.amount) : ''}
                                onChange={e => setHouseholdFees(prev => ({ 
                                  ...prev, 
                                  [maHo]: { 
                                    ...prev[maHo], 
                                    amount: parseInt(e.target.value.replace(/[^\d]/g, '')) || 0,
                                    auto: false,
                                    owner: ownerName // Keep the owner information
                                  } 
                                }))}
                                inputMode="numeric"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {errors.householdFees && <p className="text-xs text-red-500 mt-2">{errors.householdFees}</p>}
              </div>
            )}
            {/* Loại phí tự động: luôn hiển thị bảng danh sách hộ và số tiền tự động, không liên quan file */}
            {isAutoFeeType && households.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Số tiền theo hộ</h4>
                  <p className="text-sm text-gray-500">Tổng thu: <span className="font-semibold text-gray-700">{formatCurrency(totalFeeAmount)} VND</span></p>
                </div>
                <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mã hộ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Chủ hộ</th>
                        {selectedFeeType && 'calculateByArea' in selectedFeeType && selectedFeeType.calculateByArea && (
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Diện tích (m²)</th>
                        )}
                        {selectedFeeType && 'calculateByVehicle' in selectedFeeType && selectedFeeType.calculateByVehicle && (
                          <>
                            {hasAnyMotorbikes && <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Xe máy</th>}
                            {hasAnyCars && <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ô tô</th>}
                          </>
                        )}
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số tiền (VND)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Using filteredHouseholds here */}
                      {householdsToDisplay.map(household => (
                        <tr key={household.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{household.id}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{household.owner}</td>
                          {selectedFeeType && 'calculateByArea' in selectedFeeType && selectedFeeType.calculateByArea && (
                            <td className="px-4 py-2 text-sm text-gray-900">{household.area}</td>
                          )}
                          {selectedFeeType && 'calculateByVehicle' in selectedFeeType && selectedFeeType.calculateByVehicle && (
                            <>
                              {hasAnyMotorbikes && <td className="px-4 py-2 text-sm text-gray-900">{household.vehicles.motorbikes}</td>}
                              {hasAnyCars && <td className="px-4 py-2 text-sm text-gray-900">{household.vehicles.cars}</td>}
                            </>
                          )}
                          <td className="px-4 py-2 text-sm">
                            <input
                              type="text"
                              className="block w-28 px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 text-right transition-all hover:border-blue-400 focus:bg-blue-50"
                              placeholder="0"
                              value={householdFees[household.id]?.amount !== undefined && householdFees[household.id]?.amount !== null ? formatCurrency(householdFees[household.id].amount) : ''}
                              onChange={e => handleAmountChange(household.id, e.target.value)}
                              inputMode="numeric"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {errors.householdFees && <p className="text-xs text-red-500 mt-1">{errors.householdFees}</p>}
              </div>
            )}
            <div className="flex gap-4 mt-4">
              <button className="flex-1 px-4 py-3 bg-gray-500 text-white text-base font-semibold rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all" onClick={handleRequestClose}>Hủy</button>
              <button className="flex-1 px-4 py-3 bg-blue-500 text-white text-base font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all" onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
            {apiError && <p className="mt-4 text-sm text-red-500">{apiError}</p>}
          </div>
        </div>
      )}
      {(showConfirmClose || showConfirmSave) && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]" onClick={() => {
          setShowConfirmClose(false);
          setShowConfirmSave(false);
          setPendingAction(null);
        }}>
          <div className="bg-white rounded-lg shadow-xl px-8 py-7 max-w-sm w-full relative" onClick={e => e.stopPropagation()}>
            <p className="text-base text-gray-800 mb-6 text-center font-medium">
              {showConfirmClose && 'Những thay đổi hiện tại sẽ không được lưu lại. Bạn vẫn muốn thoát?'}
              {showConfirmSave && isEditMode && 'Bạn xác nhận lưu thay đổi cho khoản thu này?'}
              {showConfirmSave && !isEditMode && 'Bạn xác nhận tạo khoản thu mới này?'}
            </p>
            <div className="flex gap-4 w-full">
              <button className="flex-1 px-4 py-2.5 bg-gray-400 text-white rounded hover:bg-gray-500 font-medium transition-colors" onClick={() => {
                setShowConfirmClose(false);
                setShowConfirmSave(false);
                setPendingAction(null);
              }}>{showConfirmClose ? 'Chỉnh sửa tiếp' : 'Hủy'}</button>
              <button className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium transition-colors" onClick={() => {
                if (pendingAction === 'close') handleClose();
                if (pendingAction === 'save') handleSaveConfirmed();
              }}>{showConfirmClose ? 'Thoát' : 'Xác nhận'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEditFeePopup;
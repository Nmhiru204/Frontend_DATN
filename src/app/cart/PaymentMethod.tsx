type PaymentMethodProps = {
  value: "cod" | "online";
  onChange: (value: "cod" | "online") => void;
  address: string;
  onAddressChange: (value: string) => void;
};

export default function PaymentMethod({
  value,
  onChange,
  address,
  onAddressChange,
}: PaymentMethodProps) {
  return (
    <div className="w-full max-w-md bg-white p-4 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Chọn phương thức thanh toán</h2>

      <div className="space-y-3">
        {/* COD */}
        <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <div>
            <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
            <p className="text-sm text-gray-500">Bạn sẽ trả tiền khi nhận hàng</p>
          </div>
          <input
            type="radio"
            name="payment_method"
            value="cod"
            checked={value === "cod"}
            onChange={() => onChange("cod")}
            className="h-5 w-5"
          />
        </label>

        {/* Online */}
        <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <div>
            <p className="font-medium">Thanh toán Online</p>
            <p className="text-sm text-gray-500">Ví / Thẻ / Banking</p>
          </div>
          <input
            type="radio"
            name="payment_method"
            value="online"
            checked={value === "online"}
            onChange={() => onChange("online")}
            className="h-5 w-5"
          />
        </label>
      </div>

      {/* Address input (luôn hiển thị) */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Địa chỉ nhận hàng</label>
        <input
          name="adress"
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Nhập địa chỉ giao hàng..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </div>
  );
}

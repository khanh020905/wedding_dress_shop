export type Customer = {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
};

export type DressStatus = "san-sang" | "dang-thue" | "bao-tri" | "ngung";
export type DressCategory = "da-hoi" | "cong-chua" | "duoi-ca" | "toi-gian" | "khac";

export type Dress = {
  _id: string;
  code: string;
  name: string;
  category: DressCategory;
  size: string[];
  color?: string;
  rentalPrice: number;
  salePrice?: number;
  status: DressStatus;
  images?: string[];
  description?: string;
};

export type RentalStatus = "dat-coc" | "dang-thue" | "da-tra" | "huy";

export type Rental = {
  _id: string;
  customerId: string;
  dressId: string;
  rentalDate: string;
  returnDate: string;
  deposit: number;
  totalPrice: number;
  status: RentalStatus;
  note?: string;
  // do API join: tên khách & tên váy để hiển thị
  customerName?: string;
  dressName?: string;
  customer?: Customer;
  dress?: Dress;
};

export type AppointmentStatus = "moi" | "da-lien-he" | "da-den" | "huy";

export type Appointment = {
  _id: string;
  experience?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  guests?: string;
  fullName?: string;
  phone?: string;
  note?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
};

import clientPromise from "@/lib/mongodb";

type BookingPayload = {
  experience?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  guests?: string;
  fullName?: string;
  phone?: string;
  note?: string;
};

const requiredFields: Array<keyof BookingPayload> = [
  "experience",
  "appointmentDate",
  "appointmentTime",
  "guests",
  "fullName",
  "phone",
];

function normalizeValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizePayload(payload: BookingPayload): Required<BookingPayload> {
  return {
    experience: normalizeValue(payload.experience),
    appointmentDate: normalizeValue(payload.appointmentDate),
    appointmentTime: normalizeValue(payload.appointmentTime),
    guests: normalizeValue(payload.guests),
    fullName: normalizeValue(payload.fullName),
    phone: normalizeValue(payload.phone),
    note: normalizeValue(payload.note),
  };
}

function createEmailText(payload: Required<BookingPayload>) {
  return [
    "Có khách vừa gửi yêu cầu đặt lịch thử váy từ website Dream & Dress.",
    "",
    `Trải nghiệm: ${payload.experience}`,
    `Ngày hẹn: ${payload.appointmentDate}`,
    `Khung giờ: ${payload.appointmentTime}`,
    `Số người đi cùng: ${payload.guests}`,
    `Họ và tên: ${payload.fullName}`,
    `Số điện thoại: ${payload.phone}`,
    `Ghi chú: ${payload.note || "Không có"}`,
  ].join("\n");
}

function createEmailHtml(payload: Required<BookingPayload>) {
  const rows = [
    ["Trải nghiệm", payload.experience],
    ["Ngày hẹn", payload.appointmentDate],
    ["Khung giờ", payload.appointmentTime],
    ["Số người đi cùng", payload.guests],
    ["Họ và tên", payload.fullName],
    ["Số điện thoại", payload.phone],
    ["Ghi chú", payload.note || "Không có"],
  ];

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#2a241f">
      <h2 style="margin:0 0 16px">Yêu cầu đặt lịch thử váy mới</h2>
      <p>Có khách vừa gửi yêu cầu đặt lịch từ website Dream & Dress.</p>
      <table style="border-collapse:collapse;width:100%;max-width:640px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="border:1px solid #eadfce;padding:10px 12px;font-weight:700;background:#fbfaf7">${label}</td>
                <td style="border:1px solid #eadfce;padding:10px 12px">${value}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
    </div>
  `;
}

async function sendViaResend(payload: Required<BookingPayload>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_NOTIFY_EMAIL;
  const from = process.env.BOOKING_FROM_EMAIL || "Dream & Dress <onboarding@resend.dev>";

  if (!apiKey || !to) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Đặt lịch thử váy - ${payload.fullName} - ${payload.appointmentDate} ${payload.appointmentTime}`,
      text: createEmailText(payload),
      html: createEmailHtml(payload),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend email failed: ${errorText}`);
  }

  return true;
}

async function sendViaWebhook(payload: Required<BookingPayload>) {
  const webhookUrl = process.env.FORM_SUBMIT_WEBHOOK_URL;

  if (!webhookUrl) return false;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.FORM_SUBMIT_SECRET
        ? { "x-form-submit-secret": process.env.FORM_SUBMIT_SECRET }
        : {}),
    },
    body: JSON.stringify({
      formName: "booking",
      submittedAt: new Date().toISOString(),
      ...payload,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Booking webhook failed: ${errorText}`);
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const rawPayload = (await request.json()) as BookingPayload;
    const payload = sanitizePayload(rawPayload);
    const missingField = requiredFields.find((field) => !payload[field]);

    if (missingField) {
      return Response.json(
        { message: "Vui lòng điền đầy đủ thông tin bắt buộc." },
        { status: 400 },
      );
    }

    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB || "dream_dress");
      await db.collection("appointments").insertOne({
        ...payload,
        status: "moi",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (dbError) {
      console.error("Lỗi lưu lịch hẹn vào DB:", dbError);
      // Tiếp tục để gửi email/webhook
    }

    const sentByResend = await sendViaResend(payload);
    const sentByWebhook = sentByResend ? false : await sendViaWebhook(payload);

    if (!sentByResend && !sentByWebhook) {
      return Response.json(
        {
          message:
            "Chưa cấu hình email nhận đơn. Vui lòng thêm RESEND_API_KEY và BOOKING_NOTIFY_EMAIL hoặc FORM_SUBMIT_WEBHOOK_URL.",
        },
        { status: 500 },
      );
    }

    return Response.json({
      message: "Đã gửi thông tin đặt lịch. Chúng tôi sẽ liên hệ lại sớm.",
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Không thể gửi thông tin đặt lịch. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}

import { EditAccountInfoFormType, UserType } from "@/lib/schemas/user";

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  console.log("Received token:", token);
  if (token !== "dummy_access_token") {
    return Response.json({ detail: "Invalid token" }, { status: 401 });
  }
  const user: UserType = {
    id: "1",
    email: "admin@admin1.com",
    full_name: "Admin User",
    role: "admin",
    phone_number: "0123456789",
    is_email_verified: true,
    is_phone_verified: false,
    active_status: true,
    created_at: new Date("2025-01-01T10:00:00.000Z"),
    updated_at: new Date("2025-02-01T10:00:00.000Z"),
    bio: "I am the admin user.",
  };
  return Response.json(user);
}

export async function PATCH(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  console.log("Received token for PATCH:", token);
  if (token !== "dummy_access_token") {
    return Response.json({ detail: "Invalid token" }, { status: 401 });
  } else {
    const body = (await req.json()) as EditAccountInfoFormType;
    console.log("Received body for PATCH:", body);
    const updatedUser: UserType = {
      id: "1",
      email: "thien@gmail.com",
      full_name: body.full_name || "Admin User",
      role: "admin",
      phone_number: body.phone_number || "0123456789",
      is_email_verified: true,
      is_phone_verified: false,
      active_status: true,
      created_at: new Date("2025-01-01T10:00:00.000Z"),
      updated_at: new Date(),
      bio: "I am the admin user.",
    };
    return Response.json(updatedUser);
  }
}

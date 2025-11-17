from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from core.config import settings
from pydantic import EmailStr
from typing import List

# 1. Tạo đối tượng Cấu hình (Config)
conf = ConnectionConfig(
    MAIL_USERNAME = settings.MAIL_USERNAME,
    MAIL_PASSWORD = settings.MAIL_PASSWORD,
    MAIL_FROM = settings.MAIL_FROM,
    MAIL_PORT = settings.MAIL_PORT,
    MAIL_SERVER = settings.MAIL_SERVER,
    MAIL_STARTTLS = settings.MAIL_STARTTLS,
    MAIL_SSL_TLS = settings.MAIL_SSL_TLS,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

# 2. Đây là hàm mà BackgroundTasks sẽ gọi
async def send_email_func(to_email: EmailStr, subject: str, message: str):
    """
    Hàm (async) để gửi email.
    """
    
    # 3. Tạo nội dung email
    html_content = f"""
    <html>
    <body>
        <p>Xin chào,</p>
        <p>{message}</p>
        <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua.</p>
    </body>
    </html>
    """
    
    message_data = MessageSchema(
        subject=subject,
        recipients=[to_email],
        body=html_content,
        subtype=MessageType.html
    )

    # 4. Khởi tạo FastMail và gửi
    fm = FastMail(conf)
    try:
        await fm.send_message(message_data)
        print(f"Đã gửi email thành công tới {to_email}")
    except Exception as e:
        print(f"Lỗi khi gửi email tới {to_email}: {e}")
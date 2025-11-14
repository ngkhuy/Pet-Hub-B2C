import asyncio
import json
from uuid import UUID
import aio_pika
from aio_pika.abc import AbstractIncomingMessage
from sqlmodel.ext.asyncio.session import AsyncSession

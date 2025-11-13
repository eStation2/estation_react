"""
Celery application configuration for eStation backend
Handles background tasks and asynchronous processing
"""

import os
from celery import Celery

# Create Celery instance
celery_app = Celery(
    "estation_tasks",
    broker=os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/0"),
    include=["app.tasks"]
)

# Configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    result_expires=3600,  # 1 hour
)

# Auto-discover tasks
celery_app.autodiscover_tasks()

# Task routing
celery_app.conf.task_routes = {
    "app.tasks.process_geospatial_data": {"queue": "geospatial"},
    "app.tasks.generate_report": {"queue": "reports"},
}

# Monitoring
celery_app.conf.worker_send_task_events = True
celery_app.conf.task_send_sent_event = True

if __name__ == "__main__":
    celery_app.start()
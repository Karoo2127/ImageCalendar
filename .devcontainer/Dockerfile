FROM python:3.8
ENV PYTHONUNBUFFERED 1 
RUN pip install django
RUN pip install mysqlclient
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev
RUN pip install grpcio==1.41.0
RUN pip install grpcio-tools==1.41.0
RUN pip install stability-sdk
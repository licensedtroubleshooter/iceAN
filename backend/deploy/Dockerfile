FROM python:3.7

WORKDIR /opt/python_app

# App is served internally on *:8000, proxied by nginx container elsewhere
COPY stuff/ ./

# Installing dependencies
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["python", "server.py"]

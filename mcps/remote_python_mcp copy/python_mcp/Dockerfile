FROM python:3.12-slim
WORKDIR /app
RUN pip install "mcp[cli]"
COPY python_server.py /app/server.py

ENV PORT=8001
EXPOSE ${PORT}
CMD ["python", "/app/server.py"]

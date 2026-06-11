# 1. Pull directly from AWS public mirror to bypass Northflank's broken proxy
FROM public.ecr.aws/docker/library/python:3.11-alpine

# 2. Setup the application directory
WORKDIR /app

# 3. Copy files and install Python websockets
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy the python script
COPY server.py .

# 5. Force open port 10000
EXPOSE 10000

# 6. Run the script directly
CMD ["sh", "-c", "ls -la /app && echo RUNNING && python -u server.py"]
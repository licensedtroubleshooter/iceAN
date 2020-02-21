FROM lppier/docker-prophet

WORKDIR /app

COPY . /app
RUN apt-get -y update  && apt-get install -y \
  python3-dev \
  apt-utils \
  python-dev \
  build-essential \
&& rm -rf /var/lib/apt/lists/*

RUN pip install -r /app/requirements.txt

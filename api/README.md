<img src="https://github.com/att/qujata/assets/7979328/199a9c84-840b-415e-a221-621c22184ad2" width="300">

## Description
This is a `Post Quantum Cryptography` tool,
<br/>
using Python framework.


## Pre-requisite
[Python](#https://www.python.org/downloads)(includes pip) has to be installed on your system in order to run this project.

## Installation

1. To start, clone the qujata repository:
```bash
git clone https://github.com/att/qujata.git
cd qujata/api
```
2. Install python packages:
```bash
pip3 install -r requirements.txt
```

3. Running the application:
```bash
python3 app.py
```

4. Application is available now in: `http://localhost:3020`, curl example:
```bash
curl http://localhost:3020/analyze -H 'Content-Type: application/json'  --data-raw '{"algorithms":["kyber512"], "iterationsCount":200}'
```




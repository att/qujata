<img src="https://github.com/att/qujata/assets/7979328/199a9c84-840b-415e-a221-621c22184ad2" width="300">

# Summary

- [**Overview**](#overview)
- [**Algorithms**](#algorithms)
- [**Installation & Setup**](#installation--setup)
- [**Running PQC Testbed**](#running-pqc-testbed)
- [**Contributing**](#contributing)
- [**Code of Conduct**](#conde-of-conduct)
- [**License**](#license)


# Overview

In recent years, there has been a substantial amount of research on quantum computers – machines that exploit quantum mechanical phenomena to solve mathematical problems that are difficult or intractable for conventional computers. If large-scale quantum computers are ever built, they will be able to break many of the public-key cryptosystems currently in use. This would seriously compromise the confidentiality and integrity of digital communications on the Internet and elsewhere.  The goal of post-quantum cryptography (also called quantum-resistant cryptography) is to develop cryptographic systems that are secure against both quantum and classical computers, and can interoperate with existing communications protocols and networks.

Qujata project (after myth creature Kujata or Quyata) is a testbed, evaluating the performance of the supported Quantum-Safe Crypto protocols by their client & server vital signs, like memory and cpu usage, connection time, download speed, once connection is established, etc.

# Algorithms

### Algorithms supported

This section lists all quantum-safe algorithms supported by this oqs testbed.

As standardization for these algorithms within TLS is not done, all TLS code points/IDs can be changed from their default values to values set by environment variables. This facilitates interoperability testing with TLS1.3 implementations that use different IDs.

### Code points/algorithm IDs

<!--- OQS_TEMPLATE_FRAGMENT_IDS_START -->
|Algorithm name | default ID | enabled | environment variable |
|---------------|:----------:|:-------:|----------------------|
| frodo640aes | 0x0200 | Yes | OQS_CODEPOINT_FRODO640AES |
| frodo640shake | 0x0201 | Yes | OQS_CODEPOINT_FRODO640SHAKE |
| frodo976aes | 0x0202 | Yes | OQS_CODEPOINT_FRODO976AES |
| frodo976shake | 0x0203 | Yes | OQS_CODEPOINT_FRODO976SHAKE |
| frodo1344aes | 0x0204 | Yes | OQS_CODEPOINT_FRODO1344AES |
| frodo1344shake | 0x0205 | Yes | OQS_CODEPOINT_FRODO1344SHAKE |
| kyber512 | 0x023A | Yes | OQS_CODEPOINT_KYBER512 |
| p256_kyber512 | 0x2F3A | Yes | OQS_CODEPOINT_P256_KYBER512 |
| kyber768 | 0x023C | Yes | OQS_CODEPOINT_KYBER768 |
| p384_kyber768 | 0x2F3C | Yes | OQS_CODEPOINT_P384_KYBER768 |
| kyber1024 | 0x023D | Yes | OQS_CODEPOINT_KYBER1024 |
| bikel1 | 0x0241 | Yes | OQS_CODEPOINT_BIKEL1 |
| bikel3 | 0x0242 | Yes | OQS_CODEPOINT_BIKEL3 |
| bikel5 | 0x0243 | Yes | OQS_CODEPOINT_BIKEL5 |
| hqc128 | 0x022C | Yes | OQS_CODEPOINT_HQC128 |
| hqc192 | 0x022D | Yes | OQS_CODEPOINT_HQC192 |
| hqc256 | 0x022E | Yes | OQS_CODEPOINT_HQC256 |
<!--- OQS_TEMPLATE_FRAGMENT_IDS_END -->


# Installation & Setup

Install `npm` and `node.js`. Instructions can be found [here](https://nodejs.org/en/download).

Initialize `api` by the following stages:
```
$ git clone <ENTER_GITHUB_BACKEND_URL_HERE>
$ cd api
$ npm install
```

Initialize `portal` by the following stages:
```
$ git clone <ENTER_GITHUB_PORTAL_URL_HERE>
$ cd portal
$ yarn
```

# Running Qujata (PQC Testbed)

### Platform limitations - an important note

Pay attention that the Operating System of the machine running this project has an effect on the proper data returned in the results.
<br/>
Not all algorithms are equally well-supported on all platforms. In case of questions, it is first advised to review the [documentation files for each algorithm](https://github.com/open-quantum-safe/liboqs/tree/main/docs/algorithms).
<br/>
<ul>
  <li>On Mac, it is expected to work well and was tested with AllowedAlgorithms.</li>
  <li>On Windows, some Algorithms may not be supported by `Open Quantum Safe` docker images, but the code will work successfully.<br/>(Seeing `downloadSpeed=0` is suspected to be a sign of no-support for selected Algorithm).</li>
  <li>Other Platforms were not tested yet.</li>
</ul>

### `Development`
`api`:

1. First, open a Terminal / Command-Line on this project's folder and run:<br/>
```bash
$ docker compose up
```
 - You need to verify that 2 images went up and are running ("curl" & "nginx") using `docker ps`.<br/><br/>
2. Second, run the app:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

3. Lastly, in order to see any results, you can either:
- Run Postman with a POST request:
```bash
curl --location 'http://localhost:3010/test/' \
--header 'Content-Type: application/json' \
--data '{
    "algorithm": "kyber512",
    "iterationsCount": 5
}'
```
- Run the FrontEnd Portal (pqc-quantum-portal), from this repository: <ENTER_GITHUB_PORTAL_URL_HERE>

`portal`:

1. Start a development server.
    - Working with mock-data server:
         - In the root folder, run the client:
            ```bash
            cd mock-server
            yarn
            yarn start:mock:client
            ```
         - Inside `mock-server` folder, run `yarn serve` (if the command fails, run `yarn run-server` to start).

    - Working with running backend, from this repository: <ENTER_GITHUB_BACKEND_URL_HERE>.
        ```bash
          yarn start:quantum-api
        ```
2. Open the browser with `http://localhost:3010/`

# Contributing

Information about how to contribute, can be found [here](CONTRIBUTING.md).

# Acknowledgements

Qujata project is based on [Open Quantum Safe](https://github.com/open-quantum-safe) project and other work done by [NIST](https://csrc.nist.gov/projects/post-quantum-cryptography) and other organization and individuals, working on PQC (Post Quantum Safe) cryptography algorithms

# Code of Conduct

Code of conduct can be found [here](https://github.com/att/qujata/blob/main/CODE_OF_CONDUCT.md)

# License

License can be found [here](https://github.com/att/qujata/blob/main/LICENSE.md).

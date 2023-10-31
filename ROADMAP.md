# Project Roadmap 
Our benchmarking tool aims to understand, evaluate, and prepare for the integration of post-quantum cryptographic (PQC) algorithms in real-world scenarios. As we progress, our roadmap is designed to deepen our understanding, enhance our tools, learn from the community and gather valuable insights together.

### Phase 1: Full Stack Benchmarking Tool for TLS
* Functional Path: Develop a comprehensive benchmarking tool that evaluates the performance of post-quantum cryptographic algorithms within the context of a full TLS handshake. This will provide a holistic view of how these algorithms influence real-world applications.
* Architectural Path: The tool will be implemented using a modular microservices-based architecture, deployed on Kubernetes. It will integrate the OQS forks of Nginx and Curl, orchestrated by an Admin API and UI. Monitoring will be facilitated through Prometheus and Grafana, while metrics and logs are exposed via cAdvisor and kube-state-metrics. 
### Phase 2: Real-world Scenario Testing
* Functional Path: Extend the tool to emulate real-world application scenarios, replicating standard user behaviors and interactions over secure channels. This involves introducing traffic patterns, application-specific interactions, and multi-session simulations.
* Architectural Path: Incorporate components simulate diverse user behaviors and generate traffic patterns. Integrate a Pod operator mechanism to preemptively manage and spin up new pods based on user input or anticipated demand.
### Phase 3: Benchmarking Non-TLS Protocols
* Functional Path: Expand the tool's capabilities to also benchmark popular non-TLS protocols integrating PQC, such as SSH, VPNs, and secure file transfers.
* Architectural Path: Introduce protocol-specific plugins or extensions to the benchmarking tool, ensuring flexible and accurate metrics collection for each protocol.
### Continuous Enhancements
* Functional Path: Consistently update the tool to accommodate the latest PQC algorithms and stay aligned with evolving standards.
* Architectural Path: Adopt a plug-and-play model to seamlessly integrate new algorithms or protocols into the benchmarking tool. Ensure the platform remains cloud-agnostic, facilitating deployments on any major cloud service or on-premises.
* Analysis and Refinement: Regularly analyze the collected metrics, refining tools based on insights, and re-evaluating the significance of certain metrics to ensure the tool's continued relevance and accuracy.
### Community Engagement and Open Data
Our ultimate goal is not just internal knowledge but to provide the community with valuable insights. We plan to make our findings public, engage with the community for feedback, and open-source our tools for collaborative enhancement.

# Architecture
### Moving from our working prototype (phase 0) to phase 1

![image](https://github.com/att/qujata/assets/142991359/d2daca87-884c-4a05-95e5-8fa3c7168340)

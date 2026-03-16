export const researchService = {
  getIEEESeedData: () => [
    {
      id: 'ieee-1',
      title: 'Deep Learning for Autonomous Traffic Sign Recognition',
      publisher: 'IEEE Transactions on Intelligent Transportation Systems',
      conference: 'IEEE ITS 2025',
      description: 'A comprehensive study on robust deep learning architectures for real-time traffic sign detection in various weather conditions.',
      link: 'https://ieeexplore.ieee.org/document/1234567',
      topic: 'Computer Vision',
      deadline: Date.now() + 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-2',
      title: 'Quantum Advantage in Cryptographic Protocols',
      publisher: 'IEEE Transactions on Quantum Engineering',
      conference: 'IEEE QCE 2025',
      description: 'Analyzing the scalability and security of post-quantum cryptographic standards in enterprise environments.',
      link: 'https://ieeexplore.ieee.org/document/2345678',
      topic: 'Quantum Computing',
      deadline: Date.now() + 45 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-3',
      title: 'Scalable Microservices Architecture for Edge Computing',
      publisher: 'IEEE Cloud Computing',
      conference: 'IEEE ICFC 2025',
      description: 'Designing high-performance microservices that operate at the network edge with minimal latency.',
      link: 'https://ieeexplore.ieee.org/document/3456789',
      topic: 'Cloud Computing',
      deadline: Date.now() + 15 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-4',
      title: 'Blockchain for Secure Medical Data Exchange',
      publisher: 'IEEE Journal of Biomedical and Health Informatics',
      conference: 'IEEE EMBC 2025',
      description: 'A decentralized approach to patient data privacy and sharing using smart contracts.',
      link: 'https://ieeexplore.ieee.org/document/4567890',
      topic: 'Blockchain',
      deadline: Date.now() + 60 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-5',
      title: 'Adversarial Attacks on Large Language Models',
      publisher: 'IEEE Transactions on Information Forensics and Security',
      conference: 'IEEE S&P 2025',
      description: 'Investigating prompt injection and jailbreak techniques in production-ready transformer models.',
      link: 'https://ieeexplore.ieee.org/document/5678901',
      topic: 'Cybersecurity',
      deadline: Date.now() + 20 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-6',
      title: 'Energy-Efficient Resource Allocation in 6G Networks',
      publisher: 'IEEE Transactions on Communications',
      conference: 'IEEE ICC 2025',
      description: 'Optimizing bandwidth and power consumption in next-generation satellite-integrated terrestrial networks.',
      link: 'https://ieeexplore.ieee.org/document/6789012',
      topic: 'Networking',
      deadline: Date.now() + 40 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-7',
      title: 'Generative AI for Synthesizing PCB Designs',
      publisher: 'IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems',
      conference: 'IEEE DAC 2025',
      description: 'Automating hardware layout generation using diffusion models and reinforcement learning.',
      link: 'https://ieeexplore.ieee.org/document/7890123',
      topic: 'Hardware Design',
      deadline: Date.now() + 35 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-8',
      title: 'Ethical Implications of Affective Computing and Facial Recognition',
      publisher: 'IEEE Transactions on Affective Computing',
      conference: 'IEEE ACII 2025',
      description: 'A socio-technical analysis of bias and surveillance in emotion-detecting AI systems.',
      link: 'https://ieeexplore.ieee.org/document/8901234',
      topic: 'AI Ethics',
      deadline: Date.now() + 50 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-9',
      title: 'Neuromorphic Computing for Low-Power Robotics',
      publisher: 'IEEE Transactions on Neural Networks and Learning Systems',
      conference: 'IEEE ICRA 2025',
      description: 'Implementing spiking neural networks on dedicated hardware for autonomous drone navigation.',
      link: 'https://ieeexplore.ieee.org/document/9012345',
      topic: 'Robotics',
      deadline: Date.now() + 25 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-10',
      title: 'Multi-Agent Reinforcement Learning for Smart Grid Management',
      publisher: 'IEEE Transactions on Smart Grid',
      conference: 'IEEE ISGT 2025',
      description: 'Balancing supply and demand in decentralized energy markets using cooperative RL.',
      link: 'https://ieeexplore.ieee.org/document/0123456',
      topic: 'Smart Grid',
      deadline: Date.now() + 45 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-11',
      title: 'Graph Neural Networks for Drug Discovery',
      publisher: 'IEEE/ACM Transactions on Computational Biology and Bioinformatics',
      conference: 'IEEE BIBM 2025',
      description: 'Predicting molecular binding affinity using relational graph convolution networks.',
      link: 'https://ieeexplore.ieee.org/document/1230456',
      topic: 'Bioinformatics',
      deadline: Date.now() + 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-12',
      title: 'Privacy-Preserving Federated Learning in Mobile Health',
      publisher: 'IEEE Transactions on Mobile Computing',
      conference: 'IEEE INFOCOM 2025',
      description: 'Differential privacy and secure multi-party computation in distributed medical learning.',
      link: 'https://ieeexplore.ieee.org/document/2340567',
      topic: 'Privacy',
      deadline: Date.now() + 10 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-13',
      title: 'Explainable AI for Credit Scoring in FinTech',
      publisher: 'IEEE Transactions on Services Computing',
      conference: 'IEEE ICWS 2025',
      description: 'Bridging the gap between model performance and financial regulatory transparency.',
      link: 'https://ieeexplore.ieee.org/document/3450678',
      topic: 'FinTech',
      deadline: Date.now() + 55 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-14',
      title: 'Real-time Object Tracking in High-G Environments',
      publisher: 'IEEE Transactions on Aerospace and Electronic Systems',
      conference: 'IEEE Aerospace 2025',
      description: 'Robust Kalman filtering and deep tracking for hypersonic vehicle payloads.',
      link: 'https://ieeexplore.ieee.org/document/4560789',
      topic: 'Aerospace',
      deadline: Date.now() + 15 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-15',
      title: 'Soft Robotics for Minimally Invasive Surgery',
      publisher: 'IEEE Transactions on Medical Robotics and Bionics',
      conference: 'IEEE BioRob 2025',
      description: 'Design and control of pneumatically actuated compliant surgical tools.',
      link: 'https://ieeexplore.ieee.org/document/5670890',
      topic: 'MedTech',
      deadline: Date.now() + 40 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-16',
      title: 'Transformer-based Time Series Forecasting for Stock Markets',
      publisher: 'IEEE Transactions on Knowledge and Data Engineering',
      conference: 'IEEE ICDM 2025',
      description: 'A study on long-term dependency modeling in financial data using self-attention.',
      link: 'https://ieeexplore.ieee.org/document/6780901',
      topic: 'Data Science',
      deadline: Date.now() + 20 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-17',
      title: 'Lidar-Visual SLAM for Indoor Drone Navigation',
      publisher: 'IEEE Robotics and Automation Letters',
      conference: 'IEEE IROS 2025',
      description: 'Fusion of sparse lidar and RGB-D data for robust localization in feature-poor environments.',
      link: 'https://ieeexplore.ieee.org/document/7890012',
      topic: 'SLAM',
      deadline: Date.now() + 35 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-18',
      title: 'Digital Twins for Sustainable Urban Planning',
      publisher: 'IEEE Transactions on Systems, Man, and Cybernetics: Systems',
      conference: 'IEEE SMC 2025',
      description: 'Simulating city-wide energy consumption and traffic flow using real-time sensor integration.',
      link: 'https://ieeexplore.ieee.org/document/8900123',
      topic: 'Smart Cities',
      deadline: Date.now() + 50 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-19',
      title: 'Neural Architecture Search for TinyML Devices',
      publisher: 'IEEE Transactions on Very Large Scale Integration (VLSI) Systems',
      conference: 'IEEE ISCAS 2025',
      description: 'Automating the design of ultra-compact models for deployment on 8-bit microcontrollers.',
      link: 'https://ieeexplore.ieee.org/document/9010234',
      topic: 'Embedded AI',
      deadline: Date.now() + 25 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-20',
      title: 'Haptic Feedback in Virtual Reality Rehabilitation',
      publisher: 'IEEE Transactions on Haptics',
      conference: 'IEEE VR 2025',
      description: 'Enhancing motor skill recovery in stroke patients through vibrotactile stimulation.',
      link: 'https://ieeexplore.ieee.org/document/0120345',
      topic: 'Human-Computer Interaction',
      deadline: Date.now() + 45 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-21',
      title: 'Sub-Terahertz Communications for 7G Exploration',
      publisher: 'IEEE Transactions on Terahertz Science and Technology',
      conference: 'IEEE Globecom 2025',
      description: 'Channel modeling and beamforming techniques for frequencies above 100 GHz.',
      link: 'https://ieeexplore.ieee.org/document/1230001',
      topic: 'Next-Gen Wireless',
      deadline: Date.now() + 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-22',
      title: 'Reinforcement Learning for Automated Penetration Testing',
      publisher: 'IEEE Transactions on Dependable and Secure Computing',
      conference: 'IEEE CNS 2025',
      description: 'Modeling network exploits as MDPs to automate red-teaming operations.',
      link: 'https://ieeexplore.ieee.org/document/2340002',
      topic: 'Offensive Security',
      deadline: Date.now() + 40 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-23',
      title: 'Low-Latency Video Streaming for Remote Surgery',
      publisher: 'IEEE Transactions on Multimedia',
      conference: 'IEEE ICME 2025',
      description: 'Adaptive bitrate algorithms optimized for sub-50ms glass-to-glass latency.',
      link: 'https://ieeexplore.ieee.org/document/3450003',
      topic: 'Multimedia',
      deadline: Date.now() + 15 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-24',
      title: 'Carbon-Nanotube-based Sensors for Air Quality Monitoring',
      publisher: 'IEEE Sensors Journal',
      conference: 'IEEE SENSORS 2025',
      description: 'Developing high-sensitivity gas sensors for VOC detection in industrial environments.',
      link: 'https://ieeexplore.ieee.org/document/4560004',
      topic: 'Hardware/Sensors',
      deadline: Date.now() + 60 * 24 * 60 * 60 * 1000
    },
    {
      id: 'ieee-25',
      title: 'Autonomous Navigation of Underwater Swarms',
      publisher: 'IEEE Journal of Oceanic Engineering',
      conference: 'IEEE OCEANS 2025',
      description: 'Bio-inspired swarm behavior for large-scale seabed mapping with minimal acoustic profile.',
      link: 'https://ieeexplore.ieee.org/document/5670005',
      topic: 'Ocean Engineering',
      deadline: Date.now() + 35 * 24 * 60 * 60 * 1000
    }
  ]
};

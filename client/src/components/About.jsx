import "../styles/About.css";

function About({ isAbout }) {
  const useCases = [
    {
      id: 1,
      title: "📚 Academic Research",
      subtitle: "Transform your studies",
      description:
        "Upload research papers, textbooks, and articles. Ask specific questions about methodologies, findings, or compare different studies instantly.",
      examples: [
        '"What are the key findings in this psychology study?"',
        '"Compare the methodologies used in these three papers"',
        '"Summarize the main arguments from Chapter 5"',
      ],
      icon: "🎓",
    },
    {
      id: 2,
      title: "💼 Business Intelligence",
      subtitle: "Make data-driven decisions",
      description:
        "Upload reports, contracts, market analyses, and competitor research. Get instant insights and answers from your business documents.",
      examples: [
        '"What are our Q3 performance metrics?"',
        '"Compare our pricing strategy with competitors"',
        '"What are the key terms in this contract?"',
      ],
      icon: "📊",
    },
    {
      id: 3,
      title: "⚖️ Legal Research",
      subtitle: "Navigate complex documents",
      description:
        "Upload case law, statutes, contracts, and legal briefs. Quickly find relevant precedents and understand complex legal language.",
      examples: [
        '"What precedents support this argument?"',
        '"Explain this clause in simple terms"',
        '"Find all references to intellectual property"',
      ],
      icon: "⚖️",
    },
    {
      id: 4,
      title: "🏥 Medical Knowledge",
      subtitle: "Enhance healthcare understanding",
      description:
        "Upload medical journals, treatment protocols, and research studies. Get quick answers about treatments, symptoms, and medical procedures.",
      examples: [
        '"What are the side effects of this treatment?"',
        '"Compare these two therapeutic approaches"',
        '"What does this study say about patient outcomes?"',
      ],
      icon: "🩺",
    },
    {
      id: 5,
      title: "🛠️ Technical Documentation",
      subtitle: "Master complex systems",
      description:
        "Upload manuals, API docs, and technical guides. Get instant help with implementation details and troubleshooting.",
      examples: [
        '"How do I configure this API endpoint?"',
        '"What are the system requirements?"',
        '"Walk me through the installation process"',
      ],
      icon: "⚙️",
    },
    {
      id: 6,
      title: "📖 Content Creation",
      subtitle: "Streamline your writing",
      description:
        "Upload reference materials, style guides, and research sources. Create consistent, well-informed content faster.",
      examples: [
        '"What tone should I use for this brand?"',
        '"Find supporting data for this argument"',
        '"What are the key points to cover?"',
      ],
      icon: "✍️",
    },
  ];

  const features = [
    {
      title: "🚀 Instant Processing",
      description:
        "Upload PDFs or paste URLs and start querying your knowledge base within seconds",
    },
    {
      title: "🔍 Smart Search",
      description:
        "Ask natural language questions and get precise answers from your documents",
    },
    {
      title: "💾 Persistent Memory",
      description:
        "Your knowledge base grows with each upload and remembers conversation context",
    },
    {
      title: "🌐 Web Integration",
      description:
        "Ingest content from any website URL to expand your knowledge instantly",
    },
    {
      title: "🔒 Secure & Private",
      description:
        "Your documents and conversations are processed securely with user authentication",
    },
    {
      title: "💬 Conversational AI",
      description:
        "Natural dialogue with context awareness for follow-up questions",
    },
  ];

  return (
    <>
      {isAbout ? (
        <div className="master-about">
          <div className="about-content">
            <div className="about-use-cases-div">
              <h2 className="use-case-title">Use Cases</h2>
              <ul>
                {useCases.map((useCase, index) => (
                  <li key={index}>
                    <strong>{useCase.title}</strong>: {useCase.description}
                  </li>
                ))}
              </ul>
            </div>
            <div className="about-features-div">
              <h2 className="feature-title">Features</h2>
              <ul>
                {features.map((feature, index) => (
                  <li key={index}>
                    <strong>{feature.title}</strong>: {feature.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="invisible-about">
          <h2>Click the arrow to view RAG it's features</h2>
        </div>
      )}
    </>
  );
}

export default About;
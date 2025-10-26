import React, { useState } from 'react';
import './css/HomePage.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [selectedPlan, setSelectedPlan] = useState('sim-protection');
    const [showPricing, setShowPricing] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const plans = {
        'sim-protection': {
            name: 'SIM Protection',
            price: 'R39.99',
            features: [
                'Real-time SIM Swap Detection',
                'Instant Bank Account Freeze',
                '$1M Identity Theft Insurance',
                '24/7 Emergency Support',
                'Multi-Channel Alerts'
            ]
        },
        'credit-lock': {
            name: '+ Credit Lock',
            price: 'R49.99',
            features: [
                'All SIM Protection Features',
                'Credit File Lock & Monitoring',
                'Credit Change Alerts',
                '3-Bureau Credit Monitoring',
                'Fraud Resolution Support'
            ]
        },
        'data-broker': {
            name: '+ Data Broker Removal',
            price: 'R59.99',
            features: [
                'All Credit Lock Features',
                'Automated Data Broker Removal',
                'Dark Web Monitoring',
                'Personal Information Scanning',
                'Continuous Privacy Protection'
            ]
        }
    };

    const faqs = [
        {
            question: "What happens during a SIM swap attack?",
            answer: "We instantly block the SIM swap with your carrier and automatically freeze your linked bank accounts, email, and social media to prevent any financial loss or identity theft."
        },
        {
            question: "How do you verify my identity?",
            answer: "We use the same secure bank-level verification process: government ID scan and live selfie verification. Your biometric data is encrypted and deleted after 90 days."
        },
        {
            question: "Can I travel without triggering false alarms?",
            answer: "Yes! Our dashboard lets you pre-declare travel plans, new devices, or legitimate SIM changes to prevent false positives."
        },
        {
            question: "What's your false positive policy?",
            answer: "If we accidentally freeze your accounts, our 24/7 team will immediately verify your identity and restore access. We continuously learn from each incident to improve accuracy."
        },
        {
            question: "How quickly do you respond to threats?",
            answer: "We act in seconds - automatically blocking swaps and freezing accounts before asking for verification. Speed is critical in preventing financial loss."
        }
    ];

    const securityFeatures = [
        {
            icon: '🏦',
            title: 'Bank-Level Security',
            description: 'SOC 2 Type II certified systems with hardware security modules'
        },
        {
            icon: '📄',
            title: 'FSP Licensed',
            description: 'Fully regulated financial services provider #FSP123456'
        },
        {
            icon: '🔒',
            title: 'Military-Grade Encryption',
            description: 'AES-256 encryption and immutable audit logs'
        },
        {
            icon: '👥',
            title: '24/7 Human Team',
            description: 'Security operations center with real experts, not just algorithms'
        }
    ];

    const steps = [
        {
            step: 1,
            title: "See Your Price",
            description: "Transparent pricing with no hidden fees"
        },
        {
            step: 2,
            title: "Verify Your Identity",
            description: "Quick, secure bank-level ID verification"
        },
        {
            step: 3,
            title: "Set Your Rules",
            description: "Choose your protection level and link accounts"
        },
        {
            step: 4,
            title: "Live Protected",
            description: "We monitor 24/7, you live securely"
        }
    ];

    return (
        <div className="homepage">
            {/* HERO SECTION */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badges">
                        <span className="badge">FSP Licensed</span>
                        <span className="badge">Bank-Level Security</span>
                        <span className="badge">24/7 Protection</span>
                    </div>
                    <h1 className="hero-title">
                        Protect Your Phone Number,
                        <span className="highlight"> Protect Your Life</span>
                    </h1>
                    <p className="hero-subtitle">
                        SIM swap attacks can drain your bank accounts in minutes. We detect and block them instantly,
                        freezing your accounts before thieves can strike. Your digital life, secured.
                    </p>
                    <div className="hero-actions">
                        {/* <button 
              className="btn-primary"
              onClick={() => setShowPricing(true)}
            >
              Get Protected in Minutes
            </button> */}
                        <Link to="/register" className="btn-primary">
                            Register here
                        </Link>
                        {/* <button 
        className="btn-primary"
        onClick={() => setIsRegisterOpen(true)}
      >
        Get Protected in Minutes
      </button>

      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      /> */}
                        <button className="btn-secondary">
                            How It Works ↓
                        </button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="protection-shield">
                        <div className="shield-icon">🛡️</div>
                        <div className="shield-text">Protected</div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="steps-section">
                <h2>How It Works in 4 Simple Steps</h2>
                <div className="steps-grid">
                    {steps.map((step) => (
                        <div key={step.step} className="step-card">
                            <div className="step-number">{step.step}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECURITY BADGES */}
            <section className="security-section">
                <h2>Enterprise-Grade Security</h2>
                <div className="security-grid">
                    {securityFeatures.map((feature, index) => (
                        <div key={index} className="security-card">
                            <div className="security-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* PRICING SECTION */}
            <section className="pricing-section">
                <h2>Choose Your Protection Level</h2>
                <p className="pricing-subtitle">All plans include our core SIM protection technology</p>

                <div className="pricing-grid">
                    {Object.entries(plans).map(([key, plan]) => (
                        <div
                            key={key}
                            className={`pricing-card ${selectedPlan === key ? 'selected' : ''}`}
                            onClick={() => setSelectedPlan(key)}
                        >
                            <div className="plan-header">
                                <h3>{plan.name}</h3>
                                <div className="plan-price">{plan.price}<span>/month</span></div>
                            </div>
                            <ul className="plan-features">
                                {plan.features.map((feature, index) => (
                                    <li key={index}>✓ {feature}</li>
                                ))}
                            </ul>
                            <button className="btn-select">
                                {selectedPlan === key ? 'Selected' : 'Select Plan'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="pricing-actions">
                    <button className="btn-primary-lg">
                        Continue to Secure Registration
                    </button>
                    <p className="security-note">
                        🔒 Bank-level verification required. 14-day money-back guarantee.
                    </p>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="faq-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-grid">
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-card">
                            <h3>{faq.question}</h3>
                            <p>{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Secure Your Digital Life?</h2>
                    <p>Join thousands of protected users sleeping better at night.</p>
                    <button className="btn-primary-lg">
                        Get Started - See Your Price
                    </button>
                    <div className="cta-guarantee">
                        <span>✓ 14-day money-back guarantee</span>
                        <span>✓ No long-term contract</span>
                        <span>✓ Cancel anytime</span>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="homepage-footer">
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="/privacy">Privacy Notice</a>
                        <a href="/terms">Terms of Service</a>
                        <a href="/policy">Policy Wording</a>
                        <a href="/fsp">FSP License</a>
                        <a href="/support">Support</a>
                    </div>
                    <div className="footer-legal">
                        <p>© 2024 YourCompany. FSP License #123456. All rights reserved.</p>
                        <p>Your data is protected by SOC 2 Type II certified systems.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;